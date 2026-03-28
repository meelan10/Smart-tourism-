from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='BookingLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('action', models.CharField(choices=[('book_hotel','Book Hotel'),('book_guide','Book Guide'),('save_dest','Save Destination'),('subscribe','Newsletter Subscribe'),('contact','Contact Form')], max_length=30)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('item_name', models.CharField(blank=True, max_length=300)),
                ('item_id', models.IntegerField(blank=True, null=True)),
                ('extra_data', models.JSONField(blank=True, default=dict)),
                ('ip_address', models.GenericIPAddressField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='booking_logs', to='auth.user')),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
