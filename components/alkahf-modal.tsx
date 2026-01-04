"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface AlKahfModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AlKahfModal({ isOpen, onClose }: AlKahfModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const verses = [
    {
      arabic:
        "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا",
      translation:
        "All praise is due to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.",
      number: 1,
    },
    {
      arabic:
        "قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا",
      translation:
        "[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward.",
      number: 2,
    },
    {
      arabic: "مَّاكِثِينَ فِيهِ أَبَدًا",
      translation: "In which they will remain forever.",
      number: 3,
    },
    {
      arabic: "وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا",
      translation: "And to warn those who say, 'Allah has taken a son.'",
      number: 4,
    },
    {
      arabic:
        "مَّا لَهُم بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا",
      translation:
        "They have no knowledge of it, nor had their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.",
      number: 5,
    },
    {
      arabic:
        "فَلَعَلَّكَ بَاخِعٌ نَّفْسَكَ عَلَىٰ آثَارِهِمْ إِن لَّمْ يُؤْمِنُوا بِهَٰذَا الْحَدِيثِ أَسَفًا",
      translation:
        "Then perhaps you would kill yourself through grief over them, [O Muhammad], if they do not believe in this message, [and] out of sorrow.",
      number: 6,
    },
    {
      arabic:
        "إِنَّا جَعَلْنَا مَا عَلَى الْأَرْضِ زِينَةً لَّهَا لِنَبْلُوَهُمْ أَيُّهُمْ أَحْسَنُ عَمَلًا",
      translation:
        "Indeed, We have made that which is on the earth adornment for it that We may test them [as to] which of them is best in deed.",
      number: 7,
    },
    {
      arabic: "وَإِنَّا لَجَاعِلُونَ مَا عَلَيْهَا صَعِيدًا جُرُزًا",
      translation:
        "And indeed, We will make that which is upon it [into] a barren ground.",
      number: 8,
    },
    {
      arabic:
        "أَمْ حَسِبْتَ أَنَّ أَصْحَابَ الْكَهْفِ وَالرَّقِيمِ كَانُوا مِنْ آيَاتِنَا عَجَبًا",
      translation:
        "Or have you thought that the companions of the cave and the inscription were, among Our signs, a wonder?",
      number: 9,
    },
    {
      arabic:
        "إِذْ أَوَى الْفِتْيَةُ إِلَى الْكَهْفِ فَقَالُوا رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا",
      translation:
        "[Mention] when the youths retreated to the cave and said, 'Our Lord, grant us from Yourself mercy and prepare for us from our affair right guidance.'",
      number: 10,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="glass-panel-emerald rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden pointer-events-auto border-2 border-emerald-500/30 elegant-shadow-emerald"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="relative p-8">
                <button
                  onClick={onClose}
                  className="absolute top-6 left-6 glass-panel p-3 rounded-full hover:bg-emerald-500/20 transition-all group z-10"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
                </button>

                <div className="text-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">
                    سورة الكهف
                  </h2>
                  <p className="text-emerald-300/80 font-orbitron text-sm">
                    Surah Al-Kahf (The Cave)
                  </p>
                  <p className="text-muted-foreground text-sm mt-2">
                    First 10 Verses
                  </p>
                </div>

                <div className="overflow-y-auto max-h-[calc(85vh-200px)] pr-4 space-y-6 scrollbar-hide">
                  {verses.map((verse, index) => (
                    <motion.div
                      key={verse.number}
                      className="glass-panel p-6 rounded-2xl border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center">
                          <span className="text-emerald-400 font-orbitron text-sm">
                            {verse.number}
                          </span>
                        </div>
                        <div className="flex-1 space-y-3">
                          <p className="text-2xl md:text-3xl text-foreground leading-relaxed text-right">
                            {verse.arabic}
                          </p>
                          <p
                            className="text-sm text-emerald-300/70 leading-relaxed"
                            dir="ltr"
                          >
                            {verse.translation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <p className="text-emerald-400/60 text-sm">
                    May Allah accept your recitation
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
