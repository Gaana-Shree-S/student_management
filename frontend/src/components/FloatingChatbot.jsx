import React, { useState, useEffect, useRef } from 'react'

const CUSTOMER_CARE = '📞 1800-123-456'

const KNOWLEDGE_BASE = {
  attendance: `
📌 Attendance Information

You can view your complete attendance record from:
Dashboard → Attendance

Here you will find:
• Subject-wise attendance percentage  
• Daily presence/absence details  
• Eligibility status for examinations  

⚠️ If you notice any mismatch, please inform your class teacher or contact the administration office.
  `,

  marks: `
📊 Marks & Performance

Your academic marks are available at:
Dashboard → Academics → Marks

This section includes:
• Internal assessment marks  
• Semester examination results  
• Subject-wise grade details  

📞 For corrections or re-evaluation queries, please contact the concerned faculty.
  `,

  fees: `
💰 Fee Details & Payments

You can check your fee information at:
Dashboard → Finance → Fee Management

This includes:
• Total fee structure  
• Paid and pending dues  
• Downloadable payment receipts  

⚠️ If payment is not reflected, please wait 24 hours or contact the accounts department.
  `,

  timetable: `
📅 Class Timetable

Your class schedule is available at:
Dashboard → Schedule

You can view:
• Daily and weekly class timings  
• Subject and faculty allocation  
• Classroom / lab details  

📢 Any timetable changes will be notified through official notices.
  `,

  exam: `
📝 Examination Information

Exam-related details are available at:
Dashboard → Exams

This includes:
• Exam timetable  
• Seating arrangements  
• Result announcements  

📌 Please check regularly for updates before exam dates.
  `,

  assignment: `
📚 Assignments & Submissions

Assignments can be accessed from:
Dashboard → Academics → Assignments

You can:
• View assigned tasks  
• Check due dates  
• Upload submissions  
• Track evaluation status  

⚠️ Late submissions may not be accepted unless approved by faculty.
  `,

  admission: `
🎓 Admission & Enrollment

Admission details are handled in:
Dashboard → Admissions

Here you can:
• Track application status  
• Verify submitted documents  
• Download admission confirmation  

📞 For document verification issues, contact the admission office.
  `,

  notice: `
📢 Notices & Announcements

All official announcements are available at:
Dashboard → Notices

Includes:
• Academic circulars  
• Examination updates  
• Holiday announcements  

📌 Please check notices daily to stay updated.
  `,

  help: `
🤝 How I Can Help You

You can ask me about:
• Attendance  
• Marks and grades  
• Fees and payments  
• Timetable  
• Exams  
• Assignments  
• Admissions  
• Notices  

Just type your question in simple words 😊
  `,
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const getBotReply = text => {
    const lower = text.toLowerCase()
    for (const key in KNOWLEDGE_BASE) {
      if (lower.includes(key)) return KNOWLEDGE_BASE[key]
    }
    return `
❓ Unable to find an answer

Sorry, I couldn't understand your query clearly.

📞 Please contact Customer Care for further assistance:
${CUSTOMER_CARE}
    `
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    setTimeout(() => {
      const botMsg = {
        id: Date.now() + 1,
        sender: 'bot',
        text: getBotReply(userMsg.text),
      }
      setMessages(prev => [...prev, botMsg])
    }, 300)
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => {
            setOpen(true)
            if (messages.length === 0) {
              setMessages([
                {
                  id: 'welcome',
                  sender: 'bot',
                  text: `
👋 Welcome!

I’m your virtual help assistant.
You can ask me about attendance, marks, fees, exams, timetable, assignments, or notices.

How may I help you today?
                  `,
                },
              ])
            }
          }}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: '50%',
            backgroundColor: '#2563eb',
            color: '#fff',
            fontSize: 24,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            zIndex: 9999,
          }}
        >
          💬
        </button>
      )}

      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 360,
            height: 540,
            background: '#fff',
            borderRadius: 12,
            boxShadow: '0 15px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              background: '#2563eb',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <strong>Help Assistant</strong>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'transparent',
                color: '#fff',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
              }}
            >
              ✖
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: 12,
              overflowY: 'auto',
              background: '#f9fafb',
            }}
          >
            {messages.map(m => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justifyContent:
                    m.sender === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    whiteSpace: 'pre-line',
                    background:
                      m.sender === 'user' ? '#2563eb' : '#fff',
                    color: m.sender === 'user' ? '#fff' : '#000',
                    border:
                      m.sender === 'bot'
                        ? '1px solid #e5e7eb'
                        : 'none',
                  }}
                >
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div
            style={{
              padding: 10,
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: 8,
            }}
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="Type your question..."
              style={{
                flex: 1,
                padding: 8,
                fontSize: 13,
                borderRadius: 6,
                border: '1px solid #d1d5db',
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: '0 14px',
                background: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
