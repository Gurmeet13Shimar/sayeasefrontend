import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Youtube, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Education is the passport to the future.",
  "Don't watch the clock; do what it does. Keep going.",
  "Study while others are sleeping; work while others are loafing.",
  "The beautiful thing about learning is that no one can take it away from you.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Dream it. Wish it. Do it.",
  "Don't stop when you're tired. Stop when you're done.",
  "Wake up with determination. Go to bed with satisfaction.",
  "Do something today that your future self will thank you for.",
];

const studyVideos = [
  {
    id: "1",
    title: "10 Study Motivation Tips",
    videoId: "gx8QAFGQQ40",
    channel: "Thomas Frank",
  },
  {
    id: "2",
    title: "How to Study Effectively",
    videoId: "ukLnPbIffxE",
    channel: "Ali Abdaal",
  },
  {
    id: "3",
    title: "5 Minute Meditation",
    videoId: "inpok4MKVLM",
    channel: "Goodful",
  },
  {
    id: "4",
    title: "Productivity Tips for Students",
    videoId: "VqBiJJLTJMY",
    channel: "Med School Insiders",
  },
];

export default function Wellness() {
  const [currentQuote, setCurrentQuote] = useState(
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]
  );

  const refreshQuote = () => {
    const newQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setCurrentQuote(newQuote);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold" style={{ fontFamily: "Outfit, sans-serif", color: "#B33791" }}>
          Mental Wellness
        </h2>
        <p className="text-muted-foreground mt-1">
          Take care of your mind with motivation, meditation, and positivity
        </p>
      </div>

      {/* Daily Quote */}
      <Card
        className="rounded-3xl shadow-lg overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #FFDCDC 0%, #FEE2AD 50%, #FDCFFA 100%)",
        }}
      >
        <CardContent className="p-12 text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-6" style={{ color: "#B33791" }} />
          <h3
            className="text-3xl md:text-4xl font-bold mb-6 leading-relaxed"
            style={{ fontFamily: "Quicksand, sans-serif", color: "#CD2C58" }}
          >
            "{currentQuote}"
          </h3>
          <Button
            onClick={refreshQuote}
            data-testid="button-refresh-quote"
            variant="outline"
            className="rounded-full px-6 py-3 font-semibold border-2"
            style={{ borderColor: "#B33791", color: "#B33791" }}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quote
          </Button>
        </CardContent>
      </Card>

      {/* Motivational Videos */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Youtube className="w-6 h-6" style={{ color: "#CD2C58" }} />
          <h3 className="text-2xl font-bold" style={{ fontFamily: "Outfit, sans-serif" }}>
            Study & Motivation Videos
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {studyVideos.map((video) => (
            <Card
              key={video.id}
              data-testid={`video-card-${video.id}`}
              className="rounded-2xl shadow-md overflow-hidden hover-elevate"
            >
              <div className="relative aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.videoId}`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">{video.title}</h4>
                <p className="text-sm text-muted-foreground">{video.channel}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Wellness Tips */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" style={{ color: "#B33791" }} />
            <span>Wellness Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Take Breaks",
                description: "Study for 25 minutes, then take a 5-minute break (Pomodoro Technique)",
                color: "#FFBDBD",
              },
              {
                title: "Stay Hydrated",
                description: "Drink water regularly to keep your brain functioning optimally",
                color: "#FEE2AD",
              },
              {
                title: "Get Enough Sleep",
                description: "Aim for 7-9 hours of quality sleep each night for better retention",
                color: "#A888B5",
              },
              {
                title: "Practice Mindfulness",
                description: "Take 5 minutes daily to meditate or practice deep breathing",
                color: "#FDCFFA",
              },
            ].map((tip, index) => (
              <div
                key={index}
                data-testid={`tip-card-${index}`}
                className="p-6 rounded-2xl"
                style={{ backgroundColor: tip.color + "40" }}
              >
                <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affirmations */}
      <Card className="rounded-2xl shadow-md" style={{ backgroundColor: "#FFF2EF" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "#CD2C58" }} />
            <span>Daily Affirmations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "I am capable of achieving my academic goals",
              "Every study session brings me closer to success",
              "I embrace challenges as opportunities to grow",
              "My mental health is just as important as my grades",
              "I am proud of my progress, no matter how small",
            ].map((affirmation, index) => (
              <div
                key={index}
                data-testid={`affirmation-${index}`}
                className="flex items-start gap-3 p-4 rounded-xl hover-elevate"
                style={{ backgroundColor: "#FFDCDC" }}
              >
                <div
                  className="w-2 h-2 rounded-full mt-2"
                  style={{ backgroundColor: "#CD2C58" }}
                />
                <p className="flex-1 font-medium" style={{ color: "#8174A0" }}>
                  {affirmation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
