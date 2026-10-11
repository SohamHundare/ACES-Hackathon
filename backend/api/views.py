import json
import math
import os

import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv
from google import genai
from google.genai.errors import APIError

load_dotenv()

DATA_GOV_API_KEY = os.getenv("DATA_GOV_API_KEY")
MAPBOX_ACCESS_TOKEN = os.getenv("MAPBOX_ACCESS_TOKEN")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

DATA_GOV_URL = (
    "https://api.data.gov.in/resource/"
    "9ef84268-d588-965c-a14b-0c99e160c16e"
)
MAPBOX_DIRECTIONS_URL = (
    "https://api.mapbox.com/directions/v5/mapbox/driving"
)

FALLBACK_PRICES = {
    "tomato": 36.0,
    "tomatoes": 36.0,
    "onion": 28.0,
    "onions": 28.0,
    "potato": 25.0,
    "potatoes": 25.0,
    "capsicum": 42.0,
    "spinach": 30.0,
    "coriander": 50.0,
    "fenugreek": 34.0,
    "amaranth": 32.0,
}

TARGET_MARKETS = [
    {"market_name": "Vashi APMC", "lat": 19.0760, "lng": 72.8777},
    {"market_name": "Pune APMC", "lat": 18.5204, "lng": 73.8567},
    {"market_name": "Nashik APMC", "lat": 19.9975, "lng": 73.7898},
    {"market_name": "Solapur APMC", "lat": 17.6599, "lng": 75.9064},
]


def get_mandi_price(crop):
    """Return a per-kilogram mandi price, using fallback prices when needed."""
    normalized_crop = crop.strip().lower()
    fallback = {
        "crop": normalized_crop,
        "price_per_kg": FALLBACK_PRICES.get(normalized_crop, 30.0),
        "source": "fallback",
    }

    if not DATA_GOV_API_KEY:
        return fallback

    commodity = {
        "tomatoes": "Tomato",
        "tomato": "Tomato",
        "onions": "Onion",
        "onion": "Onion",
    }.get(normalized_crop, normalized_crop.title())
    try:
        response = requests.get(
            DATA_GOV_URL,
            params={
                "api-key": DATA_GOV_API_KEY,
                "format": "json",
                "filters[commodity]": commodity,
                "limit": 10,
            },
            timeout=10,
        )
        response.raise_for_status()
        records = response.json().get("records", [])
        prices = [
            float(record["modal_price"]) / 100
            for record in records
            if record.get("modal_price") not in (None, "")
            and float(record["modal_price"]) > 0
        ]
        if not prices:
            return fallback

        return {
            "crop": normalized_crop,
            "price_per_kg": sum(prices) / len(prices),
            "source": "data.gov.in",
        }
    except (requests.RequestException, ValueError, TypeError, KeyError):
        return fallback


def _error(message, status):
    return JsonResponse({"error": message}, status=status)


@csrf_exempt
def optimize_dispatch(request):
    if request.method != "POST":
        return _error("Only POST requests are supported.", 405)

    try:
        payload = json.loads(request.body)
        lat = float(payload["lat"])
        lng = float(payload["lng"])
        crop = payload["crop"]
        quantity = float(payload["quantity"])
    except (json.JSONDecodeError, KeyError, TypeError, ValueError):
        return _error("Provide valid lat, lng, crop, and quantity values.", 400)

    if (
        not math.isfinite(lat)
        or not math.isfinite(lng)
        or not -90 <= lat <= 90
        or not -180 <= lng <= 180
        or not math.isfinite(quantity)
        or quantity <= 0
        or not isinstance(crop, str)
        or not crop.strip()
    ):
        return _error("Coordinates, crop, or quantity are outside valid ranges.", 400)

    if not MAPBOX_ACCESS_TOKEN:
        return _error("Map routing is not configured on the server.", 503)
    if not GEMINI_API_KEY:
        return _error("AI advisory is not configured on the server.", 503)

    price_info = get_mandi_price(crop)
    mandi_price = price_info["price_per_kg"]
    all_markets = []

    for market in TARGET_MARKETS:
        coordinates = f"{lng},{lat};{market['lng']},{market['lat']}"
        try:
            response = requests.get(
                f"{MAPBOX_DIRECTIONS_URL}/{coordinates}",
                params={"access_token": MAPBOX_ACCESS_TOKEN, "overview": "false"},
                timeout=15,
            )
            response.raise_for_status()
            routes = response.json().get("routes", [])
            if not routes:
                return _error(
                    f"Map routing returned no route for {market['market_name']}.",
                    502,
                )
            distance_km = routes[0]["distance"] / 1000
            duration_hours = routes[0]["duration"] / 3600
        except (requests.RequestException, ValueError, TypeError, KeyError):
            return _error(
                f"Unable to retrieve a route for {market['market_name']}.",
                502,
            )

        gross_revenue = quantity * mandi_price
        transport_cost = distance_km * 10 
        perishability_loss = gross_revenue * (duration_hours * 0.015)
        net_profit = gross_revenue - transport_cost - perishability_loss
        all_markets.append(
            {
                **market,
                "distance_km": distance_km,
                "duration_hours": duration_hours,
                "mandi_price_per_kg": mandi_price,
                "price_source": price_info["source"],
                "gross_revenue": gross_revenue,
                "transport_cost": transport_cost,
                "perishability_loss": perishability_loss,
                "net_profit": net_profit,
            }
        )

    all_markets.sort(key=lambda item: item["net_profit"], reverse=True)
    best_market = all_markets[0]
    prompt = (
        f"Write exactly two short sentences for an Indian farmer. Explain why "
        f"{best_market['market_name']} is the best market for this {crop} "
        f"dispatch, using its {best_market['distance_km']:.1f} km distance "
        f"and estimated net profit of ₹{best_market['net_profit']:.0f}. "
        "Use clear, practical rural-friendly language."
    )

    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        generation = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        ai_advisory = generation.text
        if not ai_advisory:
            return _error("The AI service returned an empty advisory.", 502)
    except APIError:
        return _error("Unable to generate the AI advisory right now.", 502)

    return JsonResponse(
        {
            "best_market": best_market,
            "all_markets": all_markets,
            "ai_advisory": ai_advisory,
        }
    )
