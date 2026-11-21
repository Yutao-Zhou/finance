import { useEffect, useRef, useState } from "react";
import { formatDate, hasContent, text } from "../lib/reports";
import "./BriefListening.css";

const copy = {
  zh: {
    idle: "听晨报",
    playing: "暂停",
    paused: "继续",
    stop: "停止",
    starting: "正在准备播报",
    listening: "正在播报晨报",
    finished: "晨报播报已结束",
    stopped: "晨报播报已停止",
    unsupported: "此浏览器不支持朗读。",
    unavailable: "没有可用的中文语音，请检查设备的语音设置。",
    failed: "无法开始或继续朗读，请重试或检查设备的语音设置。",
    description: "朗读本期摘要、焦点新闻和盘前观察。",
  },
  en: {
    idle: "Listen to brief",
    playing: "Pause",
    paused: "Resume",
    stop: "Stop",
    starting: "Preparing to read the briefing",
    listening: "Reading the briefing",
    finished: "Briefing playback finished",
    stopped: "Briefing playback stopped",
    unsupported: "This browser does not support read aloud.",
    unavailable:
      "No English voice is available. Check your device’s speech settings.",
    failed:
      "Read aloud could not continue. Try again or check your device’s speech settings.",
    description:
      "Reads the summary, top stories and what to watch for this edition.",
  },
};

function speechParts(report, lang, labels) {
  const sentences = [];
  const period = lang === "zh" ? "。" : ".";
  const sentenceBreak = /(?<=[。！？!?])\s*|(?<=\.)\s+/u;
  if (hasContent(report.summary, lang)) {
    sentences.push(labels.summary, text(report.summary, lang));
  }
  const stories = Array.isArray(report.topNews)
    ? report.topNews.filter((story) => hasContent(story?.title, lang))
    : [];
  if (stories.length) {
    sentences.push(labels.news);
    for (const story of stories) {
      sentences.push(text(story.title, lang));
      if (hasContent(story.impact, lang))
        sentences.push(text(story.impact, lang));
    }
  }
  if (hasContent(report.premarketFocus?.keyRisk, lang)) {
    sentences.push(labels.risk, text(report.premarketFocus.keyRisk, lang));
  }
  if (!sentences.length) return [];
  sentences.unshift(formatDate(report.date, lang));

  // Short utterances also let us resume at the start of the current sentence.
  return sentences.flatMap((part) => {
    const clean = part.replace(/https?:\/\/[^\s，。！？；）]+/giu, "").trim();
    if (!clean) return [];
    const chunks = [];
    for (let sentence of clean.split(sentenceBreak)) {
      sentence = sentence.trim();
      if (!sentence) continue;
      while (sentence.length > 200) {
        const breakAt = Math.max(
          sentence.lastIndexOf(" ", 199),
          sentence.lastIndexOf("，", 199),
          sentence.lastIndexOf("；", 199),
        );
        const end = breakAt >= 100 ? breakAt + 1 : 200;
        chunks.push(sentence.slice(0, end).trim());
        sentence = sentence.slice(end).trimStart();
      }
      if (sentence) {
        chunks.push(
          /[.!?。！？]$/u.test(sentence) ? sentence : sentence + period,
        );
      }
    }
    return chunks;
  });
}

function getVoice(voices, locale) {
  const language = locale.split("-")[0];
  const matching = voices.filter(
    (voice) => voice.lang.toLowerCase().split(/[-_]/)[0] === language,
  );
  const exact = (voice) =>
    voice.lang.toLowerCase().replace("_", "-") === locale.toLowerCase();
  return (
    matching.find((voice) => voice.localService && exact(voice)) ||
    matching.find((voice) => voice.localService) ||
    matching.find(exact) ||
    matching[0]
  );
}

function cancelPart(synth, session) {
  clearTimeout(session.startTimer);
  if (session.utterance) {
    session.utterance = null;
    synth.cancel();
  }
}

function PlaybackIcon({ name }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      {name === "playing" ? (
        <path d="M5 4h3v12H5zm7 0h3v12h-3z" />
      ) : name === "stop" ? (
        <rect x="4" y="4" width="12" height="12" rx="2" />
      ) : (
        <path d="M6 3.8v12.4l10-6.2z" />
      )}
    </svg>
  );
}

export default function BriefListening({ report, lang, sectionTitles }) {
  const labels = copy[lang];
  const locale = lang === "zh" ? "zh-CN" : "en-US";
  const synth = window.speechSynthesis;
  const supported = Boolean(synth && window.SpeechSynthesisUtterance);
  const parts = speechParts(report, lang, sectionTitles);
  const playback = useRef(null);
  const toggleRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    function release() {
      const session = playback.current;
      playback.current = null;
      if (session) cancelPart(synth, session);
    }
    return release;
  }, [synth]);

  function stop(message = "") {
    const session = playback.current;
    playback.current = null;
    if (session) cancelPart(synth, session);
    setStatus("idle");
    setFeedback(message);
  }

  function speak(session) {
    if (session.index >= session.parts.length) {
      stop("finished");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(
      session.parts[session.index],
    );
    session.utterance = utterance;
    utterance.lang = locale;
    utterance.rate = 0.95;
    if (session.voice) utterance.voice = session.voice;

    const isCurrent = () =>
      playback.current === session && session.utterance === utterance;
    utterance.onstart = () => {
      if (!isCurrent()) return;
      clearTimeout(session.startTimer);
      setFeedback("");
    };
    utterance.onend = () => {
      if (!isCurrent()) return;
      clearTimeout(session.startTimer);
      session.utterance = null;
      session.index += 1;
      speak(session);
    };
    utterance.onerror = ({ error }) => {
      if (!isCurrent()) return;
      session.utterance = null;
      stop(
        error === "language-unavailable" || error === "voice-unavailable"
          ? "unavailable"
          : "failed",
      );
    };
    session.startTimer = window.setTimeout(() => {
      if (isCurrent()) stop("failed");
    }, 12000);
    try {
      synth.speak(utterance);
    } catch {
      stop("failed");
    }
  }

  function toggle() {
    if (status === "playing") {
      cancelPart(synth, playback.current);
      setFeedback("");
      setStatus("paused");
      return;
    }
    if (!playback.current) {
      const voices = synth.getVoices();
      const voice = getVoice(voices, locale);
      if (voices.length && !voice) {
        setFeedback("unavailable");
        return;
      }
      playback.current = { parts, index: 0, voice, utterance: null };
    }
    setFeedback("starting");
    setStatus("playing");
    speak(playback.current);
  }

  if (!parts.length) return null;
  const problem = !supported
    ? labels.unsupported
    : ["failed", "unavailable"].includes(feedback) && labels[feedback];
  const message =
    problem ||
    labels[feedback] ||
    (status === "playing" ? labels.listening : "");
  return (
    <div className="brief-listening" role="group" aria-label={labels.idle}>
      <button
        className="brief-listening-toggle"
        ref={toggleRef}
        type="button"
        disabled={!supported}
        onClick={toggle}
        title={status === "idle" ? labels.description : undefined}
      >
        <PlaybackIcon name={status} />
        {labels[status]}
      </button>
      {status !== "idle" && (
        <button
          className="brief-listening-stop"
          type="button"
          onClick={() => {
            stop("stopped");
            toggleRef.current?.focus();
          }}
        >
          <PlaybackIcon name="stop" />
          {labels.stop}
        </button>
      )}
      <span
        role="status"
        className={problem ? "brief-listening-status" : "sr-only"}
      >
        {message}
      </span>
    </div>
  );
}
