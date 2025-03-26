# Generated by Django 5.1.5 on 2025-03-21 15:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user_auth', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Prompt',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prompt', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='supervisor',
            name='prompt_override',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='supervisor',
            name='prompt_list',
            field=models.ManyToManyField(blank=True, to='user_auth.prompt'),
        ),
        migrations.CreateModel(
            name='SupervisorClass',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('students', models.ManyToManyField(related_name='students', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AlterField(
            model_name='invitation',
            name='class_name',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='user_auth.supervisorclass'),
        ),
    ]
