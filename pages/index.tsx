import { useState } from 'react'
import Autobiography from '../components/autobiography'


export default function Home() {
  const [biography, setBiography] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [coverImage, setCoverImage] = useState<string | null>(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData)
    const params = new URLSearchParams()
    
    Object.keys(data).forEach(key => {
        params.append(key, data[key] as string)
    })

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 120000) // Set timeout to 120 seconds

    try {
      const response = await fetch(`/api/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      })

      if (!response.ok) {
        throw new Error('Failed to generate biography')
      }

      const result = await response.json()
      console.log("result", result)
      setBiography(result.chapters)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      console.log("done")
      setIsLoading(false)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log("change image")
        setCoverImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  console.log("biography", biography)
  if (biography) {
    return <Autobiography chapters={biography} coverImage={coverImage} />
  }

  const fieldPrompts = {
    birth: "あなたが生まれたときのエピソードや家族の反応、出生地や生まれた病院について教えてください。               ",
    childhood: "幼少期の思い出深い出来事や遊び、影響を受けた人物や出来事について教えてください。",
    elementary: "小学校時代の思い出や好きだった科目、仲の良かった友人や先生について教えてください。",
    junior_high: "中学校での部活動や趣味、経験した困難や達成したことについて教えてください。",
    high_school: "高校生活での大切な思い出や活動、影響を受けた本や映画について教えてください。",
    university: "大学で専攻した分野や興味を持ったこと、サークル活動やアルバイトについて教えてください。",
    work: "初めての仕事やキャリアの転機、社会人生活での学びや挑戦したことについて教えてください。",
    marriage: "結婚を決めた理由やプロポーズのエピソード、結婚生活で大切にしていることについて教えてください。",
    childbirth: "出産の経験やその時の気持ち、出産後の生活の変化について教えてください。",
    children: "子供との思い出や教育方針、子供の成長を見て感じたことや学んだことについて教えてください。",
    current: "現在の生活や趣味、今後の目標や夢について教えてください。"
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">自叙伝生成</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cover" className="block">表紙画像</label>
          <input type="file" id="cover" name="cover" accept="image/*" onChange={handleImageChange} className="w-full p-2 border" />
        </div>
        {Object.entries(fieldPrompts).map(([field, prompt]) => (
          <div key={field}>
            <label htmlFor={field} className="block">{prompt}</label>
            <textarea id={field} name={field} className="w-full p-2 border" required></textarea>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? '生成中...' : '自叙伝を生成'}
        </button>
      </form>
    </div>
  )
}
