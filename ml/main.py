from fastapi import FastAPI
from pydantic import BaseModel
from datetime import date,timedelta
app=FastAPI(title='Intelix Intelligence Service')
class TaskSignal(BaseModel):
    progress: float
    expected_progress: float
    days_remaining: float
    dependency_risk: float=0
    workload: float=0
    blocked: bool=False
@app.get('/health')
def health(): return {'service':'intelix-ml','status':'UP'}
@app.post('/predict')
def predict(s:TaskSignal):
    progress_gap=max(0,s.expected_progress-s.progress)
    score=min(100,round(progress_gap*.9 + max(0,10-s.days_remaining)*4 + s.dependency_risk*.2 + max(0,s.workload-80)*.5 + (20 if s.blocked else 0),1))
    level='HIGH' if score>=61 else 'MEDIUM' if score>=31 else 'LOW'
    delay=max(0,round(progress_gap/18 + (1 if s.blocked else 0),1))
    return {'risk_score':score,'risk_level':level,'predicted_delay_days':delay,'predicted_completion':str(date.today()+timedelta(days=max(1,s.days_remaining+delay))),'recommendation':'Add support or reallocate work to the highest-risk task.' if score>=61 else 'Continue monitoring progress.'}
