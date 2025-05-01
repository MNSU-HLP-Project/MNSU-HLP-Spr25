# Backend Documentation

This backend is built using Django and Django Rest Framework within it to communicate with the frontend. 

## Django Rest Framework

In general terms, the backend receives an api call from the frontend which routes to the correct function within the views.py file. For example, in urls.py this line 
```python
path("entries/", get_entries, name="entries-list")
``` 
routes the call of entries/entries/ to the function get_entries() in views.py. These functions then use decorators such as ```@api_view(['POST'])``` to determine the type of api call and ```@permission_classes([IsSupervisorOrAdminOrSuperuser])``` to handle the permission classes.

There are three main folders within the backend, details below.

## Folders
### Backend

The backend folder is responsible for most of the background logic of the Django setup. There are two files of note:

1. settings.py
   *  This file contains all of the main settings and is what manage.py looks at for configurations. In here you can find things like middleware settings and CORS settings
   *  In regards to CORS, currently all origins are allowed, this needs to be changed before deploying
   *  We also have a secret key for JWT generation. This is just set to the string secret and management for this needs to be investigated for deployment.
2. urls.py
   * This contains the routing logic for when the backend first receives a request.

### Entries

Entries is responsible for almost all of the logic in regard to reflections. There are a few files of note.

* models.py - this is where the database models are set up and managed. There are models for entries and teacher comments as well as other supporting models
* serializers.py - research serializers if unfamiliar, but contains the logic so that Django Rest Framework can send and validate data in the correct format
* urls.py - contains the routing logic for api calls that go through the entries folder
* views.py - contains the functions that handle the api calls once routed correctly

### User_auth

The user_auth folder handles all of the user management in the application. The relevant files here are:
* auth_backend.py - this extends DRF base authentication and checks the JWT that is generated. This also has permission classes enabled
* models.py - this file contains all the database files for the user management and authentication
* serializers.py - is the same as entries
* urls.py - contains all the routing information
* views.py - contains all the functions for the api calls

## Other Considerations

create_superuser.py is a script that should be ran at the start of the project. This creates a superuser in your database, see details in the overall [README.md](../README.md).