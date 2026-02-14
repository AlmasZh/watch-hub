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
    Menu,
    useMediaState,
    useMediaRemote,
} from "@vidstack/react";
import "@vidstack/react/player/styles/default/theme.css";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Minimize,
    Settings,
    Check,
    ChevronRight,
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
                playsInline
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

                {/* We extract controls to a child component so we can use hooks like useMediaState */}
                <PlayerControls />
            </MediaPlayer>
        </div>
    );
}

function PlayerControls() {
    // We can now access media state here because we are inside the MediaPlayer context
    const qualities = useMediaState("qualities");
    const currentQuality = useMediaState("quality");
    const autoQuality = useMediaState("autoQuality");
    const remote = useMediaRemote();

    return (
        <div
            className="absolute inset-0 z-0 bg-transparent"
            onClick={() => remote.togglePaused()}
        >
            {/* --- 1. CENTER BIG PLAY BUTTON --- */}
            {/* This overlay sits in the center. visible only when paused. */}
            <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                <PlayButton
                    className="group/center rounded-full bg-black/50 p-5 backdrop-blur-sm transition-all scale-100 hover:bg-black/70 hover:scale-110 pointer-events-auto opacity-0 data-[paused]:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Play className="h-10 w-10 fill-white text-white translate-x-0.5" />
                </PlayButton>
            </div>

            {/* --- 2. BOTTOM CONTROLS BAR --- */}
            <Controls.Root className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 data-[paused]:opacity-100 pointer-events-none">
                <div
                    className="flex flex-col gap-2 w-full pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                    onPointerUp={(e) => e.stopPropagation()}
                >

                    {/* Time Slider */}
                    <TimeSlider.Root className="group/slider relative mx-auto h-1.5 w-full cursor-pointer touch-none select-none items-center outline-none">
                        <TimeSlider.Track className="relative h-full w-full overflow-hidden rounded-sm bg-white/30">
                            <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] bg-blue-500 will-change-[width]" />
                            <TimeSlider.Progress className="absolute h-full w-[var(--slider-progress)] bg-white/50 will-change-[width]" />
                        </TimeSlider.Track>
                        <TimeSlider.Thumb className="absolute left-[var(--slider-fill)] top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-white transition-opacity group-hover/slider:scale-100 ring-2 ring-blue-500" />
                    </TimeSlider.Root>

                    <div className="flex items-center justify-between gap-4">
                        {/* Left Side: Play, Volume, Time */}
                        <div className="flex items-center gap-4">
                            <PlayButton className="group ring-inset ring-blue-500 hover:text-blue-400 outline-none">
                                <Play className="hidden h-6 w-6 fill-current group-data-[paused]:block" />
                                <Pause className="h-6 w-6 fill-current group-data-[paused]:hidden" />
                            </PlayButton>

                            <div className="flex items-center gap-2 group/volume">
                                <MuteButton className="group ring-inset ring-blue-500 hover:text-blue-400 outline-none">
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

                        {/* Right Side: Quality, Fullscreen */}
                        <div className="flex items-center gap-4">

                            {/* --- 3. QUALITY MENU --- */}
                            {qualities.length > 0 && (
                                <Menu.Root>
                                    <Menu.Button className="group ring-inset ring-blue-500 hover:text-blue-400 outline-none">
                                        <Settings className="h-6 w-6 transform transition-transform group-data-[open]:rotate-90" />
                                    </Menu.Button>
                                    <Menu.Content
                                        className="animate-out fade-out data-[open]:animate-in data-[open]:fade-in data-[open]:slide-in-from-bottom-2 absolute bottom-12 right-0 z-50 flex max-h-[300px] min-w-[160px] flex-col overflow-y-auto overflow-x-hidden rounded-md border border-white/10 bg-black/95 p-2 font-sans text-[13px] font-medium text-white backdrop-blur-sm shadow-xl"
                                        placement="top end"
                                    >
                                        <span className="px-2 py-1.5 text-xs text-white/50 font-semibold uppercase tracking-wider">
                                            Quality
                                        </span>
                                        <Menu.RadioGroup value={autoQuality ? "auto" : currentQuality?.id}>
                                            {/* "Auto" Option */}
                                            <Menu.Radio
                                                className="group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2 text-sm outline-none hover:bg-white/10 data-[focus]:bg-white/10"
                                                value="auto"
                                                onSelect={() => remote.requestAutoQuality()}
                                            >
                                                <Check className="mr-2 h-4 w-4 opacity-0 group-data-[checked]:opacity-100 text-blue-500" />
                                                <span className="flex-1">Auto</span>
                                            </Menu.Radio>

                                            {/* Iterate over HLS qualities (1080p, 720p, etc) */}
                                            {qualities.map((quality, i) => (
                                                <Menu.Radio
                                                    key={`${quality.id}-${i}`}
                                                    className="group relative flex w-full cursor-pointer select-none items-center justify-start rounded-sm p-2 text-sm outline-none hover:bg-white/10 data-[focus]:bg-white/10"
                                                    value={quality.id}
                                                    onSelect={() => remote.changeQuality(i)}
                                                >
                                                    <Check className="mr-2 h-4 w-4 opacity-0 group-data-[checked]:opacity-100 text-blue-500" />
                                                    <span className="flex-1">
                                                        {quality.height}p
                                                    </span>
                                                    {quality.bitrate && (
                                                        <span className="text-xs text-white/50 ml-2">
                                                            {(quality.bitrate / 1000000).toFixed(1)} Mbps
                                                        </span>
                                                    )}
                                                </Menu.Radio>
                                            ))}
                                        </Menu.RadioGroup>
                                    </Menu.Content>
                                </Menu.Root>
                            )}

                            <FullscreenButton className="group ring-inset ring-blue-500 hover:text-blue-400 outline-none">
                                <Maximize className="h-6 w-6 group-data-[fullscreen]:hidden" />
                                <Minimize className="hidden h-6 w-6 group-data-[fullscreen]:block" />
                            </FullscreenButton>
                        </div>
                    </div>
                </div>
            </Controls.Root>
        </div>
    );
}