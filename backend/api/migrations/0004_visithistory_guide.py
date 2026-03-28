from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_payment_refund_visithistory'),
    ]

    operations = [
        migrations.AddField(
            model_name='visithistory',
            name='guide',
            field=models.ForeignKey(
                blank=True, null=True,
                on_delete=django.db.models.deletion.CASCADE,
                to='api.guide'
            ),
        ),
        migrations.AlterField(
            model_name='visithistory',
            name='content_type',
            field=models.CharField(
                choices=[('destination','Destination'),('hotel','Hotel'),('guide','Guide'),('transport','Transport')],
                max_length=20
            ),
        ),
    ]
