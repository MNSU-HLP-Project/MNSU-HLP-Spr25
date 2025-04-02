# MNSU-HLP-Spr25

## Project Overview

The MNSU-HLP (Minnesota State University - High Leverage Practices) application is designed to help student teachers track their implementation of high-leverage teaching practices. The application allows students to submit entries about their teaching experiences, receive feedback from supervisors, and track their progress over time.

### Key Features

- **User Authentication**: Secure login for students, teachers, and supervisors
- **HLP Selection**: Browse and select from various High Leverage Practices
- **Entry Submission**: Submit detailed entries about teaching experiences
- **Feedback System**: Teachers can provide feedback on student entries
- **Progress Tracking**: Students can view their progress and statistics
- **Class Management**: Teachers can manage classes and view student performance
- **Notifications**: In-app notifications for new feedback and important events

## Setting Up the Project

1. Clone the repository. If you have GitHub Desktop it should be as easy as pressing the clone button. If you want to do it through command line, the link is [here](https://github.com/MNSU-HLP-Project/MNSU-HLP-Spr25).

There are two paths, one for setting up the frontend and one for the backend.

### Frontend Setup

The frontend is built using React. The steps to set up it correctly on your machine are as follows below:

1. Install Node.js on your machine. If already have node.js installed then move to the next step. If not, go to [this site](https://nodejs.org/en) and install.
2. Navigate to the ```frontend``` directory in the repo.
3. Run ```npm install --force``` TODO: Figure out dependencies issues. Not sure whey this is popping up, force is a temporary workaround.
4. Run ```npm start``` and the current React page should pop up. You will also see this in terminal.
![alt text](images/image.png)

### Backend Setup

The backend is built with Django. The steps to set up it correctly on your machine are as follows below:

1. You must have Python installed on your computer. If Python is not installed, please install it now.
2. Navigate to the main directory of the repo ```MNSU-HLP-Spr25```
3. Run the command ```python -m venv venv``` NOTE: This is for creating a virtual environment, which is highly recommended for Django. You should see a venv folder created in your repo.
4. The next step is to activate the virtual environment, which will follow different steps depending on your operating system.

WINDOWS: ```venv\Scripts\activate```

MAC: ```source venv/bin/activate```


5. Next run the command ```pip install -r requirements.txt```, this will install all the nessecary packages.
6. Navigate to the ```backend``` directory
7. Run ```python manage.py runserver``` to start up the backend server which will be available at ```127.0.0.1:8000```

## Project Structure

### Frontend

- **src/Components/**: React components for the UI
- **src/Pages/**: Page-level components
- **src/utils/**: Utility functions and API calls
- **src/dashboard/**: Admin dashboard components

### Backend

- **backend/**: Main Django project directory
- **entries/**: App for managing student entries and feedback
- **user_auth/**: App for user authentication and management

## Development Workflow

1. **Branch Management**:
   - `main`: Production-ready code
   - `Look1`: Development branch for new features
   - Create feature-specific branches for new development

2. **Testing**:
   - Test all features thoroughly before committing
   - Ensure both frontend and backend work together correctly

3. **Committing Changes**:
   - Write clear, descriptive commit messages
   - Group related changes in a single commit

## API Endpoints

### Authentication
- `POST /user_auth/login/`: User login
- `POST /user_auth/register/`: User registration

### Entries
- `GET /api/entries/`: Get all entries
- `POST /api/create-entry/`: Create a new entry
- `POST /api/user-entries/`: Get entries for the authenticated user
- `POST /api/entry-comments/:entry_id/`: Get comments for an entry
- `POST /api/add-comment/:entry_id/`: Add a comment to an entry

### Classes
- `POST /api/get-classes/`: Get classes for the authenticated teacher
- `POST /api/get-class-students/:class_id/`: Get students in a class

### Notifications
- `POST /api/notifications/`: Get notifications for the authenticated user
- `POST /api/mark-notification-read/:notification_id/`: Mark a notification as read
- `POST /api/mark-all-notifications-read/`: Mark all notifications as read

## Contributors

- MNSU HLP Project Team

## License

This project is licensed under the MIT License - see the LICENSE file for details.