# Generated by Django 5.1.3 on 2025-03-30 17:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('offers', '0002_remove_offers_offer_type_id_offers_offer_types'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offerlocation',
            name='offer_id',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='offers.offers'),
        ),
    ]
