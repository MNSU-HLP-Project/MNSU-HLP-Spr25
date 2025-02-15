from django.db import models

class Entry(models.Model):
    hlp_number = models.CharField(max_length=50)
    date = models.DateField()
    score = models.IntegerField()
    comments = models.TextField()
    
    def __str__(self):
        return f"Entry {self.hlp_number} - {self.date}"