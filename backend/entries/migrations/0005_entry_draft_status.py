from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0004_entry_entry_type'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='status',
            field=models.CharField(
                choices=[
                    ('draft', 'Draft'),
                    ('pending', 'Pending Review'),
                    ('revised', 'Revised Submission'),
                    ('approved', 'Approved'),
                    ('revision', 'Needs Revision'),
                ],
                default='pending',
                max_length=10,
            ),
        ),
    ]
