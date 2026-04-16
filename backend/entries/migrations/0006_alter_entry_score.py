from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0005_entry_draft_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='entry',
            name='score',
            field=models.CharField(
                choices=[
                    ('1', '1 – Not Yet Implemented'),
                    ('2', '2 – Awareness'),
                    ('3', '3 – Beginning Implementation'),
                    ('4', '4 – Emerging Implementation'),
                    ('5', '5 – Proficient Implementation'),
                    ('-1', 'No Choice'),
                ],
                default='-1',
                max_length=2,
            ),
        ),
    ]
