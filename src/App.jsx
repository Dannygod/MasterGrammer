import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, RefreshCcw, ArrowRight, Brain, Image as ImageIcon, Loader2, Trophy, Info, Rocket } from 'lucide-react';

const QUESTIONS = [
    {
        id: 1,
        context: "Sarah is listening to music on the sofa.",
        sentence: "Sarah sat on the sofa with her eyes ________.",
        options: ["closing", "closed", "close", "to close"],
        correct: 1,
        type: "p.p. (被動/完成)",
        explanation: "眼睛是被閉上的（或處於被閉上的狀態），與 eyes 的關係是被動，故使用 p.p.。",
        imagePrompt: "A high school girl sitting on a cozy sofa, eyes closed, wearing headphones, peaceful atmosphere, digital art style."
    },
    {
        id: 2,
        context: "The faucet is not turned off properly.",
        sentence: "You shouldn't leave the kitchen with the water ________.",
        options: ["running", "run", "to run", "ran"],
        correct: 0,
        type: "V-ing (主動/進行)",
        explanation: "水正在流動，水與流動的關係是主動且持續進行，故使用 V-ing。",
        imagePrompt: "A kitchen sink with water running from the faucet, modern kitchen background, realistic style."
    },
    {
        id: 3,
        context: "It's a very hot summer afternoon.",
        sentence: "It's hard to sleep with the window ________.",
        options: ["closing", "closed", "shutting", "open"],
        correct: 3,
        type: "adj. (形容詞/狀態)",
        explanation: "這裡需要表達窗戶「開著」的狀態，open 在此作為形容詞使用最為自然。",
        imagePrompt: "A bedroom window wide open, bright sunlight coming through, summer breeze, high quality illustration."
    },
    {
        id: 4,
        context: "A boy is feeling nervous while talking to a teacher.",
        sentence: "The boy stood there with his hands ________ his pockets.",
        options: ["into", "in", "on", "at"],
        correct: 1,
        type: "prep. (介系詞短語/位置)",
        explanation: "這裡表達手在口袋「裡面」的位置，使用介系詞短語 in his pockets。",
        imagePrompt: "A nervous teenage boy standing with hands deep in his pockets, school hallway background, anime style."
    },
    {
        id: 5,
        context: "The teacher is explaining a difficult math problem.",
        sentence: "The students listened to the teacher with their mouths ________ in surprise.",
        options: ["wide", "widely", "opening", "opened"],
        correct: 0,
        type: "adj. (形容詞/狀態)",
        explanation: "wide 在此作為形容詞補語，描述嘴巴「張大」的狀態。",
        imagePrompt: "A group of high school students in a classroom, looking surprised with mouths wide open, chalkboard background."
    },
    {
        id: 6,
        context: "A dog is following its owner in the park.",
        sentence: "Kevin walked in the park with a puppy ________ him.",
        options: ["followed", "following", "follows", "to follow"],
        correct: 1,
        type: "V-ing (主動/進行)",
        explanation: "小狗主動跟隨主人，關係是主動且正在進行，故使用 V-ing。",
        imagePrompt: "A teenage boy walking in a green park, a cute golden retriever puppy following closely behind him, sunny day."
    },
    {
        id: 7,
        context: "The task is finally completed.",
        sentence: "With the work ________, we finally had time to relax.",
        options: ["doing", "done", "do", "did"],
        correct: 1,
        type: "p.p. (被動/完成)",
        explanation: "工作是被完成的，與 work 的關係是被動，故使用 p.p. (done)。",
        imagePrompt: "A clean office desk with a 'Finished' sign, a person stretching hands in relief, sunset light through window."
    },
    {
        id: 8,
        context: "The light is left on in the room.",
        sentence: "Don't go to bed with the light ________.",
        options: ["on", "off", "opening", "opened"],
        correct: 0,
        type: "adj./adv. (狀態)",
        explanation: "on 在此表示燈「開著」的狀態，是此型態常見用法。",
        imagePrompt: "A bedroom at night with a bright desk lamp still on, cozy bed in the shadows."
    },
    {
        id: 9,
        context: "A girl is crying because of a sad movie.",
        sentence: "She finished the movie with tears ________ down her cheeks.",
        options: ["roll", "rolling", "rolled", "to roll"],
        correct: 1,
        type: "V-ing (主動/進行)",
        explanation: "眼淚主動流下，且強調流動的過程，故使用 V-ing。",
        imagePrompt: "Close up of a girl's face, tears rolling down cheeks, emotional expression, soft lighting."
    },
    {
        id: 10,
        context: "A man is reading a newspaper while his wife is cooking.",
        sentence: "Mr. White sat in the armchair with a newspaper ________ his face.",
        options: ["covered", "covering", "cover", "to cover"],
        correct: 1,
        type: "V-ing (主動/狀態)",
        explanation: "報紙「覆蓋著」臉，這是一個描述當前狀態的主動動作（報紙蓋在臉上），故用 V-ing。若用 covered 則暗示報紙被某人蓋上去的動作完成感，較不常用。",
        imagePrompt: "A man sleeping in a large armchair, a newspaper covering his face, living room background."
    }
];

const App = () => {
    const [currentStep, setCurrentStep] = useState('start');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = QUESTIONS[currentIndex];

    const handleStart = () => {
        setScore(0);
        setCurrentIndex(0);
        setCurrentStep('quiz');
        setSelectedOption(null);
        setShowFeedback(false);
    };

    const handleOptionClick = (index) => {
        if (showFeedback) return;
        setSelectedOption(index);
        setShowFeedback(true);
        if (index === currentQuestion.correct) setScore(score + 1);
    };

    const handleNext = () => {
        if (currentIndex < QUESTIONS.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            setCurrentStep('result');
        }
    };

    const getRank = () => {
        if (score === 10) return { title: "語法大師", color: "text-yellow-500", desc: "完美！你對 with 複合結構的直覺精準無比！" };
        if (score >= 8) return { title: "高一學霸", color: "text-green-500", desc: "非常優秀！你已經掌握了大部分的核心概念。" };
        if (score >= 6) return { title: "潛力新星", color: "text-blue-500", desc: "表現不錯！分清楚被動與主動的差別就無敵了。" };
        return { title: "初學勇者", color: "text-slate-500", desc: "沒關係，重點是從錯誤中學習。再試一次吧！" };
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 font-sans text-slate-800">
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-white">

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-8 text-white relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Brain size={120} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Rocket className="animate-bounce" />
                        Grammar Master
                    </h1>
                    <p className="text-indigo-100 font-medium mt-2">with + O + OC 複合結構挑戰</p>
                </div>

                {/* Content Section */}
                <div className="p-8">
                    {currentStep === 'start' && (
                        <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
                            <div className="space-y-4">
                                <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto rotate-3 hover:rotate-0 transition-transform shadow-lg">
                                    <Brain size={48} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900">準備好升級你的文法力嗎？</h2>
                                <p className="text-slate-500">這是一個互動式測驗，將測試你對 with 句型的靈活運用。</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <span className="block text-indigo-600 font-bold text-sm mb-1">⚡ 規則</span>
                                    <span className="text-xs text-slate-500">共 10 題，題題附有 AI 生成的情境圖片輔助理解。</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <span className="block text-indigo-600 font-bold text-sm mb-1">🎯 目標</span>
                                    <span className="text-xs text-slate-500">區分主動 (Ving)、被動 (pp) 與形容詞狀態。</span>
                                </div>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-xl shadow-indigo-100 hover:translate-y-[-2px] active:translate-y-[0px]"
                            >
                                即刻開始
                            </button>
                        </div>
                    )}

                    {currentStep === 'quiz' && (
                        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
                            {/* Progress & Score */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-700 ease-out"
                                        style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} / {QUESTIONS.length}</span>
                            </div>

                            {/* Enhanced Image Container */}
                            <div className="relative aspect-[16/10] bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl group">
                                <img src={`/generated_images/question_${String(currentIndex + 1).padStart(2, '0')}.png`} alt="Question" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/20">
                                        <p className="text-xs text-slate-600 italic flex items-center gap-2">
                                            <Info size={14} className="text-indigo-500" />
                                            情境：{currentQuestion.context}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Question Text */}
                            <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100/50">
                                <p className="text-xl font-bold text-slate-800 leading-tight">
                                    {currentQuestion.sentence.split('________')[0]}
                                    <span className={`inline-block mx-2 border-b-4 ${selectedOption !== null ? 'border-indigo-500 text-indigo-600' : 'border-slate-300 text-slate-300 animate-pulse'} px-2 min-w-[100px] text-center transition-colors`}>
                                        {selectedOption !== null ? currentQuestion.options[selectedOption] : "____?"}
                                    </span>
                                    {currentQuestion.sentence.split('________')[1]}
                                </p>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {currentQuestion.options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(idx)}
                                        disabled={showFeedback}
                                        className={`p-4 text-center rounded-2xl border-2 transition-all font-bold ${showFeedback
                                                ? idx === currentQuestion.correct
                                                    ? 'border-green-500 bg-green-500 text-white shadow-lg shadow-green-100'
                                                    : idx === selectedOption
                                                        ? 'border-red-500 bg-red-500 text-white'
                                                        : 'border-slate-50 opacity-30'
                                                : 'border-slate-100 bg-white hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600'
                                            }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            {/* Detailed Feedback Overlay */}
                            {showFeedback && (
                                <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            {selectedOption === currentQuestion.correct ?
                                                <CheckCircle2 className="text-green-400" /> :
                                                <XCircle className="text-red-400" />
                                            }
                                            <span className="font-black uppercase tracking-tighter">
                                                {selectedOption === currentQuestion.correct ? "Excellent!" : "Not Quite..."}
                                            </span>
                                        </div>
                                        <span className="text-[10px] bg-indigo-500 px-2 py-1 rounded-full font-bold">{currentQuestion.type}</span>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                        {currentQuestion.explanation}
                                    </p>
                                    <button
                                        onClick={handleNext}
                                        className="w-full bg-white text-slate-900 py-3 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors"
                                    >
                                        {currentIndex === QUESTIONS.length - 1 ? "查看成果" : "下一關"}
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {currentStep === 'result' && (
                        <div className="text-center py-4 space-y-8 animate-in zoom-in duration-500">
                            <div className="relative inline-block">
                                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
                                <div className="relative w-40 h-40 bg-white rounded-full flex flex-col items-center justify-center border-8 border-indigo-50 shadow-inner">
                                    <Trophy className="text-yellow-500 mb-1" size={40} />
                                    <span className="text-4xl font-black text-slate-800">{score * 10}</span>
                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Score</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className={`text-4xl font-black ${getRank().color} tracking-tighter`}>
                                    {getRank().title}
                                </h2>
                                <p className="text-slate-500 font-medium px-8">{getRank().desc}</p>
                            </div>

                            <div className="bg-slate-50 rounded-[2rem] p-6 space-y-3 border border-slate-100">
                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-400">答對題數</span>
                                    <span className="text-green-600">{score} / 10</span>
                                </div>
                                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                    <div className="bg-indigo-500 h-full" style={{ width: `${score * 10}%` }}></div>
                                </div>
                                <p className="text-[10px] text-slate-400 text-left pt-2">
                                    提示：多注意 with 後方受詞與補語的「主動/被動」關係是得分關鍵。
                                </p>
                            </div>

                            <button
                                onClick={handleStart}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl"
                            >
                                <RefreshCcw size={20} />
                                再戰一輪
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default App;
