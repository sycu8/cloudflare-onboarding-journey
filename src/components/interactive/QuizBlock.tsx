import { useEffect, useMemo, useState } from 'react';
import {
  beginnerReadinessQuiz,
  getScoreTier,
  topicLabels,
  type QuizOption,
  type QuizQuestion,
} from '../../data/quiz';

const RESULT_KEY = 'cfhub_quiz_result';

type AnswerId = QuizOption['id'];
type Phase = 'question' | 'feedback' | 'results';

function computeScore(questions: QuizQuestion[], answers: Record<string, AnswerId>) {
  return questions.filter((q) => answers[q.id] === q.correct).length;
}

export default function QuizBlock() {
  const quiz = beginnerReadinessQuiz;
  const [phase, setPhase] = useState<Phase>('question');
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerId>>({});

  const q = quiz.questions[step];
  const selected = answers[q?.id];
  const isCorrect = selected === q?.correct;
  const total = quiz.questions.length;
  const score = useMemo(() => computeScore(quiz.questions, answers), [answers, quiz.questions]);
  const tier = getScoreTier(score, total);
  const passed = score >= quiz.passingScore;

  const wrongTopics = useMemo(() => {
    const topics = new Set<string>();
    for (const question of quiz.questions) {
      if (answers[question.id] && answers[question.id] !== question.correct) {
        topics.add(question.topic);
      }
    }
    return [...topics];
  }, [answers, quiz.questions]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(RESULT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        quizId: string;
        answers?: Record<string, AnswerId>;
        score?: number;
      };
      if (saved.quizId === quiz.id && saved.answers) {
        setAnswers(saved.answers);
        setPhase('results');
      }
    } catch {
      // ignore
    }
  }, [quiz.id]);

  async function persistResult(finalAnswers: Record<string, AnswerId>, finalScore: number) {
    const didPass = finalScore >= quiz.passingScore;
    const payload = {
      quizId: quiz.id,
      score: finalScore,
      totalQuestions: total,
      passed: didPass,
      selectedPath: didPass ? 'ready' : 'review',
      language: document.documentElement.dataset.lang === 'en' ? 'en' : 'vi',
      answers: finalAnswers,
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(RESULT_KEY, JSON.stringify(payload));
      await fetch('/api/quiz-submission', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          quizId: payload.quizId,
          score: payload.score,
          totalQuestions: payload.totalQuestions,
          selectedPath: payload.selectedPath,
          language: payload.language,
        }),
      });
    } catch {
      // local result still shown
    }
  }

  function pick(id: AnswerId) {
    if (phase !== 'question') return;
    setAnswers((prev) => ({ ...prev, [q.id]: id }));
    setPhase('feedback');
  }

  function continueFromFeedback() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      setPhase('question');
      return;
    }
    setAnswers((current) => {
      const finalScore = computeScore(quiz.questions, current);
      void persistResult(current, finalScore);
      return current;
    });
    setPhase('results');
  }

  function retake() {
    setAnswers({});
    setStep(0);
    setPhase('question');
    try {
      localStorage.removeItem(RESULT_KEY);
    } catch {
      // ignore
    }
  }

  if (phase === 'results') {
    return (
      <div className="space-y-6">
        <div className="card">
          <p className="text-muted text-sm">
            <span className="lang-vi">Kết quả kiểm tra</span>
            <span className="lang-en">Knowledge check result</span>
          </p>
          <h2 className="mt-1 text-xl font-semibold">
            <span className="lang-vi">{tier.title.vi}</span>
            <span className="lang-en">{tier.title.en}</span>
          </h2>
          <p className="mt-3 text-4xl font-bold text-[var(--cf-accent)]">
            {score}/{total}
          </p>
          <p className="text-muted mt-2 text-sm leading-relaxed">
            <span className="lang-vi">{tier.message.vi}</span>
            <span className="lang-en">{tier.message.en}</span>
          </p>
          {passed ? (
            <p className="mt-2 text-sm text-[var(--cf-success,#16a34a)]">
              <span className="lang-vi">✓ Đạt ngưỡng ôn tập ({quiz.passingScore}/{total})</span>
              <span className="lang-en">✓ Review threshold met ({quiz.passingScore}/{total})</span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
              <span className="lang-vi">
                Cần ít nhất {quiz.passingScore}/{total} để coi là đã nắm cơ bản — hãy xem lại phần giải thích bên dưới.
              </span>
              <span className="lang-en">
                At least {quiz.passingScore}/{total} is recommended — review the explanations below.
              </span>
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-2">
            <a className="btn btn-primary" href={tier.primaryCta.href}>
              <span className="lang-vi">{tier.primaryCta.label.vi}</span>
              <span className="lang-en">{tier.primaryCta.label.en}</span>
            </a>
            <button type="button" className="btn btn-secondary" onClick={retake}>
              <span className="lang-vi">Làm lại quiz</span>
              <span className="lang-en">Retake quiz</span>
            </button>
          </div>
        </div>

        {wrongTopics.length > 0 ? (
          <div className="card">
            <h3 className="font-semibold">
              <span className="lang-vi">Chủ đề nên ôn lại</span>
              <span className="lang-en">Topics to review</span>
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {wrongTopics.map((topic) => {
                const label = topicLabels[topic as keyof typeof topicLabels];
                const href =
                  topic === 'glossary'
                    ? '/glossary'
                    : topic === 'cloudflare-101'
                      ? '/cloudflare-101'
                      : `/tracks/${topic}`;
                return (
                  <li key={topic}>
                    <a className="badge badge-accent link" href={href}>
                      <span className="lang-vi">{label.vi}</span>
                      <span className="lang-en">{label.en}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <section>
          <h3 className="mb-3 text-lg font-semibold">
            <span className="lang-vi">Tổng kết từng câu</span>
            <span className="lang-en">Question-by-question review</span>
          </h3>
          <ol className="space-y-4">
            {quiz.questions.map((question, i) => {
              const userAnswer = answers[question.id];
              const correct = userAnswer === question.correct;
              const userOpt = question.options.find((o) => o.id === userAnswer);
              const correctOpt = question.options.find((o) => o.id === question.correct);
              return (
                <li
                  key={question.id}
                  className={`card border-l-4 ${correct ? 'border-l-[var(--cf-success,#16a34a)]' : 'border-l-amber-500'}`}
                >
                  <p className="text-muted text-xs">
                    <span className="lang-vi">
                      Câu {i + 1} · {topicLabels[question.topic].vi}
                    </span>
                    <span className="lang-en">
                      Q{i + 1} · {topicLabels[question.topic].en}
                    </span>
                  </p>
                  <p className="mt-1 font-medium">
                    <span className="lang-vi">{question.prompt.vi}</span>
                    <span className="lang-en">{question.prompt.en}</span>
                  </p>
                  <p className="mt-2 text-sm">
                    {correct ? (
                      <span className="text-[var(--cf-success,#16a34a)]">
                        <span className="lang-vi">✓ Đúng</span>
                        <span className="lang-en">✓ Correct</span>
                      </span>
                    ) : (
                      <>
                        <span className="text-amber-600 dark:text-amber-400">
                          <span className="lang-vi">Bạn chọn: </span>
                          <span className="lang-en">Your answer: </span>
                          {userAnswer}.{' '}
                          <span className="lang-vi">{userOpt?.text.vi}</span>
                          <span className="lang-en">{userOpt?.text.en}</span>
                        </span>
                        <br />
                        <span className="lang-vi">
                          Đáp án đúng: {question.correct}. {correctOpt?.text.vi}
                        </span>
                        <span className="lang-en">
                          Correct: {question.correct}. {correctOpt?.text.en}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-muted mt-2 text-sm leading-relaxed">
                    <span className="font-medium text-[var(--cf-accent)]">
                      <span className="lang-vi">Giải thích: </span>
                      <span className="lang-en">Explanation: </span>
                    </span>
                    <span className="lang-vi">{question.explanation.vi}</span>
                    <span className="lang-en">{question.explanation.en}</span>
                  </p>
                  {question.learnMore ? (
                    <a className="link mt-2 inline-block text-sm" href={question.learnMore.href}>
                      <span className="lang-vi">{question.learnMore.label.vi} →</span>
                      <span className="lang-en">{question.learnMore.label.en} →</span>
                    </a>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    );
  }

  const progressPct = Math.round(((step + (phase === 'feedback' ? 0.5 : 0)) / total) * 100);

  return (
    <div className="space-y-4">
      <div className="h-2 overflow-hidden rounded-full bg-[var(--cf-border)]">
        <div
          className="h-full rounded-full bg-[var(--cf-accent)] transition-all duration-300"
          style={{ width: `${progressPct}%` }}
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="card">
        <p className="text-muted text-sm">
          <span className="lang-vi">
            Câu {step + 1}/{total} · {topicLabels[q.topic].vi}
          </span>
          <span className="lang-en">
            Question {step + 1}/{total} · {topicLabels[q.topic].en}
          </span>
        </p>

        {phase === 'question' ? (
          <>
            <h2 className="mt-2 text-lg font-semibold">
              <span className="lang-vi">{q.prompt.vi}</span>
              <span className="lang-en">{q.prompt.en}</span>
            </h2>
            <div className="mt-4 space-y-2">
              {q.options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className="btn btn-secondary w-full justify-start text-left"
                  onClick={() => pick(opt.id)}
                >
                  <span className="mr-2 font-mono opacity-80">{opt.id}.</span>
                  <span className="lang-vi">{opt.text.vi}</span>
                  <span className="lang-en">{opt.text.en}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div
              className={`mt-3 rounded-xl border px-4 py-3 text-sm ${
                isCorrect
                  ? 'border-[var(--cf-success,#16a34a)]/40 bg-[var(--cf-success,#16a34a)]/10'
                  : 'border-amber-500/40 bg-amber-500/10'
              }`}
            >
              <p className="font-semibold">
                {isCorrect ? (
                  <>
                    <span className="lang-vi">Chính xác!</span>
                    <span className="lang-en">Correct!</span>
                  </>
                ) : (
                  <>
                    <span className="lang-vi">Chưa đúng — đáp án đúng là {q.correct}</span>
                    <span className="lang-en">Not quite — the correct answer is {q.correct}</span>
                  </>
                )}
              </p>
              <p className="text-muted mt-2 leading-relaxed">
                <span className="lang-vi">{q.explanation.vi}</span>
                <span className="lang-en">{q.explanation.en}</span>
              </p>
              {q.learnMore ? (
                <a className="link mt-2 inline-block text-sm" href={q.learnMore.href}>
                  <span className="lang-vi">{q.learnMore.label.vi} →</span>
                  <span className="lang-en">{q.learnMore.label.en} →</span>
                </a>
              ) : null}
            </div>
            <button type="button" className="btn btn-primary mt-6 w-full" onClick={continueFromFeedback}>
              <span className="lang-vi">{step < total - 1 ? 'Câu tiếp theo' : 'Xem tổng kết'}</span>
              <span className="lang-en">{step < total - 1 ? 'Next question' : 'See summary'}</span>
            </button>
          </>
        )}
      </div>

      <p className="text-muted text-center text-xs">
        <span className="lang-vi">Chọn một đáp án — bạn sẽ thấy giải thích ngay trước khi sang câu sau.</span>
        <span className="lang-en">Pick one answer — you will see an explanation before moving on.</span>
      </p>
    </div>
  );
}
