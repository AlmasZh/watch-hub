"use client";

import {
    MediaPlayer,
    MediaProvider,
    Poster,
    Controls,
    PlayButton,
    MuteButton,
    VolumeSlider,
    TimeSlider,
    Time,
    FullscreenButton,
} from "@vidstack/react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
} from "lucide-react";

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
    return (
        <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 relative group">
            <MediaPlayer
                title={title}
                src={src}
                aspectRatio="16/9"
                load="eager"
                className="w-full h-full"
            >
                <MediaProvider>
                    {poster && (
                        <Poster
                            className="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 object-cover"
                            src={poster}
                            alt={title}
                        />
                    )}
                </MediaProvider>

                {/* Custom Controls Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-4">
                    {/* This is a visual overlay for gradient, actual controls are managed by Vidstack's default layout or we can build custom ones. 
                  For this "v1", we will use the default layout which is robust and looks good, but style it a bit.
              */}
                </div>

                <Controls.Root className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100 data-[paused]:opacity-100">
                    <div className="flex flex-col gap-2">
                        <TimeSlider.Root className="group relative mx-auto h-1.5 w-full cursor-pointer touch-none select-none items-center outline-none">
                            <TimeSlider.Track className="relative h-full w-full overflow-hidden rounded-sm bg-white/30">
                                <TimeSlider.TrackFill className="absolute h-full w-[var(--chapter-fill)] bg-blue-500 will-change-[width]" />
                                <TimeSlider.Progress className="absolute h-full w-[var(--chapter-progress)] bg-white/50 will-change-[width]" />
                            </TimeSlider.Track>
                            <TimeSlider.Thumb className="absolute left-[var(--chapter-fill)] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-opacity group-hover:scale-100 ring-2 ring-blue-500" />
                        </TimeSlider.Root>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <PlayButton className="group ring-inset ring-blue-500 hover:text-blue-400">
                                    <Play className="hidden h-6 w-6 fill-current group-data-[paused]:block" />
                                    <Pause className="h-6 w-6 fill-current group-data-[paused]:hidden" />
                                </PlayButton>

                                <div className="flex items-center gap-2 group/volume">
                                    <MuteButton className="group ring-inset ring-blue-500 hover:text-blue-400">
                                        <Volume2 className="h-6 w-6 group-data-[muted]:hidden" />
                                        <VolumeX className="hidden h-6 w-6 group-data-[muted]:block" />
                                    </MuteButton>
                                    <VolumeSlider.Root className="relative h-1.5 w-0 origin-left scale-x-0 cursor-pointer touch-none select-none bg-white/30 transition-all duration-200 group-hover/volume:w-20 group-hover/volume:scale-x-100 rounded-sm">
                                        <VolumeSlider.Track className="relative h-full w-full overflow-hidden rounded-sm bg-white/30">
                                            <VolumeSlider.TrackFill className="absolute h-full w-[var(--volume-fill)] bg-white will-change-[width]" />
                                        </VolumeSlider.Track>
                                        <VolumeSlider.Thumb className="absolute left-[var(--volume-fill)] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover/volume:opacity-100" />
                                    </VolumeSlider.Root>
                                </div>

                                <div className="flex items-center text-sm font-medium text-white/90">
                                    <Time type="current" />
                                    <span className="mx-1 text-white/50">/</span>
                                    <Time type="duration" />
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <FullscreenButton className="group ring-inset ring-blue-500 hover:text-blue-400">
                                    <Maximize className="h-6 w-6 group-data-[fullscreen]:hidden" />
                                    <Minimize className="hidden h-6 w-6 group-data-[fullscreen]:block" />
                                </FullscreenButton>
                            </div>
                        </div>
                    </div>
                </Controls.Root>

            </MediaPlayer>
        </div>
    );
}
