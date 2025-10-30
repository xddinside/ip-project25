import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Target, Clock, Star, CheckCircle, Circle } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState } from 'react';

interface Challenge {
  _id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  link?: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  isSolved?: boolean;
  userId?: string;
}

export default function ChallengeCard({ challenge, isSolved = false, userId }: ChallengeCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const markChallengeSolved = useMutation(api.challenges.markChallengeSolved);
  const rateChallenge = useMutation(api.challenges.rateChallenge);

  const challengeRating = useQuery(api.challenges.getChallengeRating, { challengeId: challenge._id as Id<"challenges"> });
  const userRating = useQuery(api.challenges.getUserRating, {
    challengeId: challenge._id as Id<"challenges">,
    userId: userId || ""
  });

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return {
          color: 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200 hover:border-green-300',
          icon: <Star size={14} className="text-green-600" />
        };
      case 'medium':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200 hover:border-yellow-300',
          icon: <Target size={14} className="text-yellow-600" />
        };
      case 'hard':
        return {
          color: 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200 hover:border-red-300',
          icon: <Clock size={14} className="text-red-600" />
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
          icon: <Target size={14} className="text-gray-600" />
        };
    }
  };

  const difficultyConfig = getDifficultyConfig(challenge.difficulty);

  const handleToggleSolved = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    setIsUpdating(true);
    try {
      await markChallengeSolved({
        // @ts-expect-error - Convex ID type mismatch
        challengeId: challenge._id,
        solved: !isSolved,
      });
    } catch (error) {
      console.error('Failed to update challenge status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRateChallenge = async (rating: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    try {
      await rateChallenge({
        challengeId: challenge._id as Id<"challenges">,
        rating,
      });
    } catch (error) {
      console.error('Failed to rate challenge:', error);
    }
  };

  const handleCardClick = () => {
    if (challenge.link) {
      window.open(challenge.link, '_blank');
    }
  };

  return (
    <Card className={`group relative overflow-hidden h-[420px] flex flex-col hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 border-border/50 hover:border-primary/30 bg-card/60 backdrop-blur-sm ${challenge.link ? 'cursor-pointer' : ''} ${isSolved ? 'ring-2 ring-green-500/30 shadow-lg shadow-green-500/10' : 'hover:shadow-primary/5'}`} onClick={handleCardClick}>
      {/* Background gradient overlay for solved challenges */}
      {isSolved && (
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 pointer-events-none" />
      )}



      <CardHeader className="pb-3 pt-2 relative flex-shrink-0">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight">
            {challenge.title}
          </CardTitle>
          {isSolved && (
            <div className="flex-shrink-0 ml-2">
              <div className="relative">
                <CheckCircle size={20} className="text-green-500 drop-shadow-sm" />
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-md animate-pulse" />
              </div>
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 group-hover:text-muted-foreground/80 transition-colors">
          {challenge.description}
        </p>
      </CardHeader>

      <CardContent className="pt-0 px-6 pb-4 space-y-5 flex-1 overflow-hidden">
        <div className="flex items-center justify-between mt-3">
          <Badge
            variant="outline"
            className={`${difficultyConfig.color} border-2 font-semibold capitalize gap-2 px-3 py-1 text-sm shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 select-none`}
          >
            {difficultyConfig.icon}
            {challenge.difficulty}
          </Badge>
          {isSolved && (
            <div className="flex items-center gap-1 text-green-600 text-xs font-medium select-none">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Completed
            </div>
          )}
        </div>

        {challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {challenge.tags.map((tag, index) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-0.5 bg-secondary/60 border border-border/50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Rating Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => {
                const filledStars = Math.floor(challengeRating?.average || 0);
                const canRate = isSolved && userId;

                if (canRate) {
                  // Interactive rating for completed challenges
                  return (
                    <button
                      key={star}
                      onClick={(e) => handleRateChallenge(star, e)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-colors duration-150 hover:scale-110"
                    >
                      <Star
                        size={16}
                        className={`${
                          star <= (hoveredRating || userRating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors duration-150`}
                      />
                    </button>
                  );
                } else {
                  // Static rating display for uncompleted challenges
                  return (
                    <div key={star} className="transition-colors duration-150">
                      <Star
                        size={16}
                        className={`${
                          star <= filledStars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        } transition-colors duration-150`}
                      />
                    </div>
                  );
                }
              })}
            </div>
            {challengeRating && (
              <span className="text-xs text-muted-foreground">
                {challengeRating.average > 0 ? (
                  <>
                    {challengeRating.average} ({challengeRating.total})
                  </>
                ) : (
                  'No ratings'
                )}
              </span>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4 mt-auto">
        {userId ? (
          <Button
            variant={isSolved ? "outline" : "default"}
            size="sm"
            onClick={handleToggleSolved}
            disabled={isUpdating}
            className={`w-full gap-2 font-medium transition-all duration-300 ${
              isSolved
                ? 'border-green-600 text-green-800 hover:bg-green-100 hover:border-green-700 bg-green-50/50 ring-2 ring-green-500/40 shadow-sm'
                : 'hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : isSolved ? (
              <>
                <CheckCircle size={16} className="text-green-600" />
                Mark as Unsolved
              </>
            ) : (
              <>
                <Circle size={16} />
                Mark as Solved
              </>
            )}
          </Button>
        ) : (
          <div className="w-full h-9" /> // Placeholder to maintain consistent height
        )}
      </CardFooter>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-transparent to-primary/0 group-hover:from-primary/5 group-hover:to-primary/5 transition-all duration-500 pointer-events-none rounded-xl" />
    </Card>
  );
}
