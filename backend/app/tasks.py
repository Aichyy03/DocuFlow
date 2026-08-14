import time
from celery import Celery

celery_app = Celery(
    "worker",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0"
)

@celery_app.task(bind=True)
def process_data_pipeline(self, filename: str, content_snippet: str):
    total_steps = 4
    for i in range(1, total_steps + 1):
        time.sleep(1)
        self.update_state(
            state='PROGRESS',
            meta={'current': i, 'total': total_steps, 'status': f'Step {i}/{total_steps} processing...'}
        )
    
    words = content_snippet.split()
    metrics = {
        "filename": filename,
        "word_count": len(words),
        "char_count": len(content_snippet),
        "status": "COMPLETED",
        "processed_at": time.strftime("%Y-%m-%d %H:%M:%S")
    }
    return metrics