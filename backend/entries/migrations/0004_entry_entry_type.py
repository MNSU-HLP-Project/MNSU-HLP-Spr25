from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0003_alter_entry_score_alter_entry_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='entry',
            name='entry_type',
            field=models.CharField(
                choices=[('practice', 'Practice'), ('observation', 'Observation')],
                default='practice',
                max_length=12,
            ),
        ),
    ]
