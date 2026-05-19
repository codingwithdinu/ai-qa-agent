import { AnimatePresence, motion } from 'framer-motion'
import { Bot, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useAppContext } from '../../context/AppContext'
import { ActionButton } from '../ui/ActionButton'
import type { AssistantMessage } from '../../types/platform'

export function AssistantPanel() {
  const { assistantOpen, setAssistantOpen } = useAppContext()
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([])
  const [suggestedActions,
    setSuggestedActions] =
    useState<string[]>([])

  useEffect(() => {
    async function loadAssistant() {
      try {
        const response =
          await api.get(
            "/assistant"
          );

        const result =
          response.data;
        setAssistantMessages(
          result.data || []
        );

      } catch (error) {
        console.error(
          "Assistant load failed",
          error
        );
      }
    }
    loadAssistant();
  }, []);

  useEffect(() => {

    const interval =
      setInterval(async () => {
        try {
          const response =
            await api.get(
              "/assistant"
            );

          const result =
            response.data;
          setAssistantMessages(
            result.data.messages || []
          )

          setSuggestedActions(
            result.data.suggestedActions || []
          );
        } catch (error) {
          console.error(error);
        }
      }, 10000);
    return () =>
      clearInterval(interval);
  }, []);


  return (
    <AnimatePresence initial={false}>
      <>
        {assistantOpen ? (
          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25 }}
            className="hidden w-[360px] shrink-0 border-l border-white/10 bg-slate-950/65 p-5 backdrop-blur-xl xl:block"
          >
            <div className="glass-panel h-full p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-cyan-400/10 p-3 text-cyan-200">
                    <Bot className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">AI Assistant</p>
                    <p className="text-xs text-slate-500">Context-aware QA copilot</p>
                  </div>
                </div>
                <button type="button" onClick={() => setAssistantOpen(false)} className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Hide
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {assistantMessages.length === 0 && (
                  <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-400">
                    No assistant insights available
                  </div>
                )}
                {assistantMessages.map((message) => (
                  <div key={message.id} className={message.author === 'AI' ? 'rounded-3xl bg-cyan-400/8 p-4' : 'rounded-3xl bg-white/5 p-4'}>
                    <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">{message.author}</p>
                    <p className="text-sm leading-7 text-slate-200">{message.content}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                <p className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-cyan-300">
                  <Sparkles className="h-3.5 w-3.5" />
                  Suggested prompts
                </p>
                {suggestedActions.map((action) => (
                  <button key={action} type="button" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-cyan-400/25 hover:text-white">
                    {action}
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <ActionButton className="w-full" variant="primary">
                  Run root-cause summary
                </ActionButton>
                <ActionButton className="w-full" variant="secondary">
                  Draft release note
                </ActionButton>
              </div>
            </div>
          </motion.aside>
        ) : (

          <button
            onClick={() => setAssistantOpen(true)}
            title="AI Assistant"
            className="
      fixed
      bottom-6
      right-6
      z-50
      flex
      h-16
      w-16
      items-center
      justify-center
      rounded-full
      border
      border-cyan-400/30
      bg-slate-950/90
      shadow-2xl
      backdrop-blur-xl
      transition
      hover:scale-110
      hover:border-cyan-400
    "
          >

            <motion.div
              animate={{
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
            >

              <Bot className="h-7 w-7 text-cyan-300" />

            </motion.div>

          </button>

        )}

      </>

    </AnimatePresence>
  )
}