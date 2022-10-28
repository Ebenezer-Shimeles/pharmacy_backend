
TWILIO_ACCOUNT_SID = 'ACb57f39c1806ca5193761baba78a644bc' 
TWILIO_AUTH_TOKEN = '7a805ff29672e5317034e4e8f1fe019b'

from twilio.rest import Client 
 
account_sid = 'ACb57f39c1806ca5193761baba78a644bc' 
auth_token = '[AuthToken]' 
client = Client(account_sid, TWILIO_AUTH_TOKEN )
 
message = client.messages.create( 
                              from_='+13022168806', 
                              messaging_service_sid='MG2e46d5df4f4620ed7e070c90c1d5f7ab', 
                              body='wdefrgtyhk',      
                              to='+251911168471' 
                          ) 
 
print(message.sid)