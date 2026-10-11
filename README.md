# ACES Hackathon Project

A full-stack web application developed as part of the ACES Hackathon using React (Vite) for the frontend and Python Django for the backend.

## Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Tailwind CSS
- Axios
- Lucide React

### Backend
- Python
- Django
- Django REST Framework
- django-cors-headers

### Database
- SQLite (Django default; can be changed if required)

## Project Structure

```text
ACES_Hackathon/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── backend/
│   ├── ACES/                 # Local Python virtual environment
│   ├── config/               # Django project configuration
│   ├── api/                  # API application
│   ├── manage.py
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

## Prerequisites

Install the following before starting:

- Node.js (compatible with the project's Vite version)
- npm
- Python 3
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ACES_Hackathon
```

### 2. Set Up the Frontend

Open a terminal in the project root and run:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed in the terminal, usually:

http://localhost:5173

### 3. Set Up the Backend

Open a second terminal in the project root and run:

```bash
cd backend
python -m venv ACES
ACES\Scripts\activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The Django backend will run at:

http://127.0.0.1:8000/

### 4. Run Both Applications

Keep both terminal sessions running:

- Frontend: `http://localhost:5173`
- Backend: `http://127.0.0.1:8000/`

The frontend communicates with the backend through Django REST API endpoints.

## Environment Variables

Create local environment files if required by the project. Add the necessary variable names and example values to a separate `.env.example` file.

Never commit actual API keys, passwords, database credentials, or Django secret keys to GitHub.

## Development Guidelines

- Keep frontend code inside `frontend/`.
- Keep backend code inside `backend/`.
- Use Django REST Framework to build API endpoints.
- Use Axios for frontend API requests.
- Commit source code and dependency lock files.
- Do not commit virtual environments, `node_modules/`, or secret environment files.

## Team Contributions

All team members should create their own local environments, install dependencies, and configure any required environment variables after cloning the repository.

## License

For hackathon and educational use. Add a formal license if required.
