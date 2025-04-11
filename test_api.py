import requests
import json

BASE_URL = "http://localhost:8000"

def test_get_prompts():
    """Test the endpoint to get prompts"""
    url = f"{BASE_URL}/entries/prompts/"
    response = requests.get(url)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_get_student_entries():
    """Test the endpoint to get student entries"""
    url = f"{BASE_URL}/entries/student/entries/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE"}  # Replace with a valid token
    response = requests.get(url, headers=headers)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_create_entry():
    """Test the endpoint to create an entry"""
    url = f"{BASE_URL}/entries/create-entry/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE", "Content-Type": "application/json"}  # Replace with a valid token
    data = {
        "hlp": "1",
        "lookfor_number": 1,
        "weekly_goal": "Test weekly goal",
        "criteria_for_mastery": "Test criteria for mastery",
        "goal_reflection": "Test goal reflection",
        "week_number": 1,
        "prompt_responses": [
            {
                "prompt": 1,  # Replace with a valid prompt ID
                "indicator": "always",
                "reflection": "Test reflection"
            }
        ],
        "evidences": [
            {
                "text": "Test evidence 1",
                "order": 1
            },
            {
                "text": "Test evidence 2",
                "order": 2
            },
            {
                "text": "Test evidence 3",
                "order": 3
            }
        ]
    }
    response = requests.post(url, headers=headers, json=data)
    print(f"POST {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code in [200, 201]:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_get_entry_detail(entry_id=1):
    """Test the endpoint to get entry details"""
    url = f"{BASE_URL}/entries/entries/{entry_id}/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE"}  # Replace with a valid token
    response = requests.get(url, headers=headers)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_add_teacher_comment(entry_id=1):
    """Test the endpoint to add a teacher comment"""
    url = f"{BASE_URL}/entries/entries/{entry_id}/comment/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE", "Content-Type": "application/json"}  # Replace with a valid token
    data = {
        "comment": "Test teacher comment",
        "score": 2
    }
    response = requests.post(url, headers=headers, json=data)
    print(f"POST {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code in [200, 201]:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_update_entry_status(entry_id=1):
    """Test the endpoint to update entry status"""
    url = f"{BASE_URL}/entries/entries/{entry_id}/status/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE", "Content-Type": "application/json"}  # Replace with a valid token
    data = {
        "status": "approved"  # or "revision"
    }
    response = requests.patch(url, headers=headers, json=data)
    print(f"PATCH {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

def test_get_supervisor_student_entries():
    """Test the endpoint to get entries for supervisor's students"""
    url = f"{BASE_URL}/entries/supervisor/student-entries/"
    headers = {"Authorization": "Bearer YOUR_TOKEN_HERE"}  # Replace with a valid token
    response = requests.get(url, headers=headers)
    print(f"GET {url}")
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print(json.dumps(response.json(), indent=2))
    else:
        print(f"Error: {response.text}")
    print("\n" + "-"*50 + "\n")

if __name__ == "__main__":
    print("Testing API endpoints...\n")
    
    # Uncomment the tests you want to run
    test_get_prompts()
    # test_get_student_entries()
    # test_create_entry()
    # test_get_entry_detail()
    # test_add_teacher_comment()
    # test_update_entry_status()
    # test_get_supervisor_student_entries()
