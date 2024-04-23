from gensim.models import LdaModel
from openai import OpenAI
from dotenv import load_dotenv

# Load the pretrained model during application startup
lda = LdaModel.load('model.pkl')
load_dotenv()
openaiclient = OpenAI()
