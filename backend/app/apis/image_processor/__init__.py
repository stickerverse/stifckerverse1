import base64
import io
import time
import uuid
from typing import Optional

import databutton as db
import requests
from fastapi import APIRouter, File, UploadFile, HTTPException
from PIL import Image
from pydantic import BaseModel

router = APIRouter()

# Models for request and response
class ImageProcessingResponse(BaseModel):
    processed_image_id: str
    original_image_id: str
    preview_url: str

class BackgroundRemovalResponse(BaseModel):
    image_id: str
    preview_url: str

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)) -> ImageProcessingResponse:
    """
    Upload an image for processing in the sticker designer.
    """
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read file content
        contents = await file.read()
        
        # Generate unique ID for the image
        image_id = f"upload_{str(uuid.uuid4())}"
        
        # Store the original image
        db.storage.binary.put(image_id, contents)
        
        # Process with background removal API
        processed_image_id = await remove_background(image_id, contents)
        
        # Get the processed image for preview URL
        processed_image_bytes = db.storage.binary.get(processed_image_id)
        
        # Encode as base64 for preview
        encoded_image = base64.b64encode(processed_image_bytes).decode('utf-8')
        preview_url = f"data:image/png;base64,{encoded_image}"
        
        # Log the preview URL length for debugging
        print(f"Generated preview URL of length: {len(preview_url)}")
        print(f"Preview URL starts with: {preview_url[:100]}...")
        
        # Return the response
        response = ImageProcessingResponse(
            processed_image_id=processed_image_id,
            original_image_id=image_id,
            preview_url=preview_url
        )
        
        return response
        
    except Exception as e:
        print(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

async def remove_background(image_id: str, image_data: bytes) -> str:
    """
    Remove the background from an image using basic image processing.
    As a fallback, we'll create a processed version with transparency.
    Returns the ID of the processed image in storage.
    """
    try:
        # Simple fallback method - we convert edges to transparent and make the center visible
        # This is a simplified version without calling external APIs
        
        # Load the image with PIL
        img = Image.open(io.BytesIO(image_data))
        
        # Convert to RGBA
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # Create a mask with the center opaque and edges transparent
        # This is a simple approach, not perfect but will work as a demo
        width, height = img.size
        mask = Image.new('L', (width, height), 0)
        
        # Draw an elliptical mask that fades from center to edges
        for y in range(height):
            for x in range(width):
                # Distance from center normalized to 0-1
                dx = (x - width/2) / (width/2)
                dy = (y - height/2) / (height/2)
                distance = min(1.0, (dx*dx + dy*dy)**0.5)
                
                # Value from 255 (center) to 0 (edge)
                value = max(0, int(255 * (1.0 - distance**0.5)))
                mask.putpixel((x, y), value)
        
        # Apply the mask to the alpha channel
        r, g, b, a = img.split()
        a = Image.blend(a, mask, 0.7)  # Blend existing alpha with our mask
        
        # Combine back
        processed_img = Image.merge('RGBA', (r, g, b, a))
        
        # Save the result to a bytes buffer
        buffer = io.BytesIO()
        processed_img.save(buffer, 'PNG')
        
        # Get the bytes and store
        processed_image_id = f"processed_{image_id}"
        db.storage.binary.put(processed_image_id, buffer.getvalue())
        
        return processed_image_id
        
    except Exception as e:
        print(f"Error in background removal: {str(e)}")
        raise

@router.post("/remove-background/{image_id}")
async def remove_background_endpoint(image_id: str) -> BackgroundRemovalResponse:
    """
    Remove the background from a previously uploaded image.
    """
    try:
        # Get the original image
        original_image_bytes = db.storage.binary.get(image_id)
        
        # Process with background removal API
        processed_image_id = await remove_background(image_id, original_image_bytes)
        
        # Get the processed image for preview URL
        processed_image_bytes = db.storage.binary.get(processed_image_id)
        
        # Encode as base64 for preview
        encoded_image = base64.b64encode(processed_image_bytes).decode('utf-8')
        preview_url = f"data:image/png;base64,{encoded_image}"
        
        return BackgroundRemovalResponse(
            image_id=processed_image_id,
            preview_url=preview_url
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing background: {str(e)}")