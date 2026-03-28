from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_bookinglog'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        # Update BookingLog — add new fields
        migrations.AddField(
            model_name='bookinglog',
            name='status',
            field=models.CharField(
                choices=[('pending','Pending'),('confirmed','Confirmed'),('cancelled','Cancelled'),('refunded','Refunded')],
                default='confirmed', max_length=20
            ),
        ),
        migrations.AddField(
            model_name='bookinglog',
            name='amount',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='bookinglog',
            name='currency',
            field=models.CharField(default='USD', max_length=10),
        ),
        migrations.AddField(
            model_name='bookinglog',
            name='payment_method',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='bookinglog',
            name='action',
            field=models.CharField(
                choices=[
                    ('book_hotel','Book Hotel'),('book_guide','Book Guide'),
                    ('book_transport','Book Transport'),('save_dest','Save Destination'),
                    ('subscribe','Newsletter Subscribe'),('contact','Contact Form'),
                ],
                max_length=30
            ),
        ),

        # Payment model
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('method', models.CharField(
                    choices=[('visa','Visa Card'),('mastercard','Mastercard'),('esewa','eSewa'),('khalti','Khalti')],
                    max_length=20
                )),
                ('amount', models.FloatField()),
                ('currency', models.CharField(default='USD', max_length=10)),
                ('status', models.CharField(
                    choices=[('pending','Pending'),('completed','Completed'),('failed','Failed'),('refunded','Refunded')],
                    default='completed', max_length=20
                )),
                ('transaction_id', models.CharField(blank=True, max_length=100)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('booking', models.OneToOneField(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='payment', to='api.bookinglog'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='payments', to='auth.user'
                )),
            ],
            options={'ordering': ['-created_at']},
        ),

        # Refund model
        migrations.CreateModel(
            name='Refund',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reason', models.TextField()),
                ('amount', models.FloatField()),
                ('status', models.CharField(
                    choices=[('requested','Requested'),('approved','Approved'),('rejected','Rejected'),('processed','Processed')],
                    default='requested', max_length=20
                )),
                ('admin_note', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('payment', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='refunds', to='api.payment'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='refunds', to='auth.user'
                )),
            ],
            options={'ordering': ['-created_at']},
        ),

        # VisitHistory model
        migrations.CreateModel(
            name='VisitHistory',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content_type', models.CharField(
                    choices=[('destination','Destination'),('hotel','Hotel'),('transport','Transport')],
                    max_length=20
                )),
                ('item_name', models.CharField(blank=True, max_length=300)),
                ('visited_at', models.DateTimeField(auto_now_add=True)),
                ('destination', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    to='api.destination'
                )),
                ('hotel', models.ForeignKey(
                    blank=True, null=True,
                    on_delete=django.db.models.deletion.CASCADE,
                    to='api.hotel'
                )),
                ('user', models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='visit_history', to='auth.user'
                )),
            ],
            options={'ordering': ['-visited_at']},
        ),
    ]
