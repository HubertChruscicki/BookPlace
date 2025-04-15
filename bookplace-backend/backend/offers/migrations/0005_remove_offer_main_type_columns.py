from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('offers', '0004_offeramenities_remove_offerdetails_air_conditioning_and_more'),
    ]

    operations = [
        migrations.RunSQL("ALTER TABLE offers_offers DROP COLUMN IF EXISTS offer_main_type_id;"),
        migrations.RunSQL("ALTER TABLE offers_offers DROP COLUMN IF EXISTS offer_main_type_id_id;"),
    ]
