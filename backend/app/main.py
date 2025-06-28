from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import logging
import asyncio
from fastapi.responses import JSONResponse
from transformers import pipeline, BartForConditionalGeneration, BartTokenizer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Text Summarization API")

# Add CORS middleware
origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and tokenizer
local_path = "./models/bart-large-cnn"
try:
    model = BartForConditionalGeneration.from_pretrained(local_path)
    tokenizer = BartTokenizer.from_pretrained(local_path)
    summarizer = pipeline("summarization", model=model, tokenizer=tokenizer)
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    raise

# Request body schema
class SummarizationRequest(BaseModel):
    text: str
    word_count: Optional[int] = 130

@app.post("/summarize")
async def summarize_text(request: SummarizationRequest):
    logger.info(f"Received request: {request}")

    # Validate input text
    text_to_summarize = request.text.strip()
    if not text_to_summarize:
        raise HTTPException(status_code=400, detail="Provided text is empty")

    loop = asyncio.get_running_loop()
    try:
        # Convert word count to token counts (1 word ≈ 1.33 tokens)
        target_word_count = request.word_count or 130
        max_tokens = int(target_word_count * 1.33)
        min_tokens = int(max(30, target_word_count * 0.8) * 1.33)

        # Generate summary
        summary = await loop.run_in_executor(
            None,
            lambda: summarizer(
                text_to_summarize,
                max_length=max_tokens,
                min_length=min_tokens,
                do_sample=False
            )[0]["summary_text"]
        )
        
        logger.info(f"Summary generated successfully: {summary}")
        return JSONResponse(content={"summary": summary}, status_code=200)
    except Exception as e:
        logger.error(f"Error during summarization: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))