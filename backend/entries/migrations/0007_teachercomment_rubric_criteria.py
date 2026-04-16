from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entries', '0006_alter_entry_score'),
    ]

    operations = [
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_self_rating',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_hlp_alignment',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_evidence_growth',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_specific_evidence',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_next_steps',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='teachercomment',
            name='criterion_organization',
            field=models.IntegerField(blank=True, null=True),
        ),
    ]
