from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0002_emailotp'),
    ]

    operations = [
        migrations.AddField(
            model_name='extenduser',
            name='grade_levels',
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name='extenduser',
            name='professional_category',
            field=models.CharField(
                blank=True,
                choices=[
                    ('principal', 'Principal'),
                    ('assistant_principal', 'Assistant Principal'),
                    ('dean', 'Dean'),
                    ('special_education_administrator', 'Special Education Administrator'),
                    ('instructional_coach', 'Instructional Coach'),
                    ('general_educator', 'General Educator'),
                    ('special_educator', 'Special Educator'),
                    ('other', 'Other'),
                ],
                default='',
                max_length=40,
            ),
        ),
        migrations.AddField(
            model_name='extenduser',
            name='other_professional_category',
            field=models.CharField(blank=True, default='', max_length=200),
        ),
        migrations.AlterField(
            model_name='studentteacher',
            name='grade_level',
            field=models.CharField(
                blank=True,
                choices=[
                    ('PK', 'Pre-Kindergarten'),
                    ('K', 'Kindergarten'),
                    ('1', '1st Grade'),
                    ('2', '2nd Grade'),
                    ('3', '3rd Grade'),
                    ('4', '4th Grade'),
                    ('5', '5th Grade'),
                    ('6', '6th Grade'),
                    ('7', '7th Grade'),
                    ('8', '8th Grade'),
                    ('9', '9th Grade'),
                    ('10', '10th Grade'),
                    ('11', '11th Grade'),
                    ('12', '12th Grade'),
                ],
                default='',
                max_length=2,
            ),
        ),
        migrations.AlterField(
            model_name='studentteacher',
            name='type_of_teacher',
            field=models.CharField(
                blank=True,
                choices=[('GE', 'General Educator'), ('SE', 'Special Educator')],
                default='',
                max_length=2,
            ),
        ),
    ]
