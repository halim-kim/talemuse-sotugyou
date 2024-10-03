import os
from fastapi import FastAPI, Request, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from openai import OpenAI
from dotenv import load_dotenv


load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY is not set")

client = OpenAI(
  organization='org-MOyA4Kg9FsqZo0vKg3oOtxf4',
  project='proj_Mmk1FL2VSTE9aJRwE5gElHlt',
  api_key=OPENAI_API_KEY
)


@app.post("/submit")
async def submit(
    request: Request,
    birth: str = Form(default=""),
    childhood: str = Form(default=""),
    elementary: str = Form(default=""),
    junior_high: str = Form(default=""),
    high_school: str = Form(default=""),
    university: str = Form(default=""),
    work: str = Form(default=""),
    marriage: str = Form(default=""),
    childbirth: str = Form(default=""),
    children: str = Form(default=""),
    current: str = Form(default="")
):
    prompt = f"""あなたは小説家です。ある人物の出来事を時系列で表示します。それを元に、その人物の伝記を作ってください。
    出来事からまるで情景が想像できるように、豊かな表現を用いて書いてください。

    以下のことを守ってください。
    - 字数は合計で5000文字程度にすること
    - 以下の5つの章に分けて出力し、各章は1000文字程度にすること。各章の初めに以下のタイトルを必ず文字通り入れること
        幼少期の思い出:
        学生時代:
        社会人としての歩み:
        家族との時間:
        新たな挑戦:
    - 各章の終わりには"##"という文字列を必ず入れること。その他の場所で"#"という文字は絶対に使わないこと
    - プレーンテキストとして出力すること
    - 出力は必ず日本語で行うこと

    以下がその人物が記入した自分についての情報です。
    出生時: {birth}
    幼年期: {childhood}
    小学校: {elementary}
    中学校: {junior_high}
    高校: {high_school}
    大学: {university}
    社会人: {work}
    結婚: {marriage}
    出産: {childbirth}
    子供: {children}
    現在: {current}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that writes biographies."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=5000
        )

        # Extract the generated text
        biography = response.choices[0].message.content
        
        # Write the content to a file
        with open('generated_biography.txt', 'w', encoding='utf-8') as file:
            file.write(biography)
        print(biography)

        chapters = biography.split('##')[:-1]
        assert len(chapters) == 5

        # Return the response
        return {"chapters": chapters}

    except Exception as e:
        # Handle any errors
        return templates.TemplateResponse("error.html", {"request": request, "error": str(e)})


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app, 
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        timeout_keep_alive=120,
        timeout_graceful_shutdown=120)
