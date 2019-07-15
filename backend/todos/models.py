from django.db import models


class Todo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        """A string representation of the model."""
        return self.title