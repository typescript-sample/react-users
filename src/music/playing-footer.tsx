import React, { useState } from 'react'
import { MusicContext } from "./context/music";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export const PlayingFooter = () => {
    const { music, setIndex } = React.useContext(MusicContext)
    const handleClickNext = () => {
        (music.listMusic && music.index !== undefined && (music.index < music.listMusic.length - 1)) ? setIndex(music.index + 1) : setIndex(0)
    };

    const handleClickPrevious = () => {
        (music.index !== undefined && music.index )? setIndex(music.index - 1) : setIndex(0)
    };
    return (
        <footer className='page-footer' >
            {
                (music.index !== undefined) && music.listMusic && (music.listMusic.length > 0) && (
                    <>
                        <div className="avatar-playing">
                            <div className="avatar-playing-img" style={{
                                backgroundImage: `url(${music.listMusic[music.index].imageURL})`
                            }}>
                            </div>
                            <div className="avatar-playing-info">
                                <div className="playing-info-name">
                                    {music.listMusic[music.index].name}
                                </div>
                                <div className="playing-info-singer">
                                    {
                                        music.listMusic[music.index].author &&
                                        music.listMusic[music.index].author?.map((c: any, i: number) => {
                                            return (
                                                <span key={i}>{(i >= 1) ? ' ,' : ''}{c}</span>
                                            )
                                        })}
                                </div>
                            </div>
                        </div>
                        {
                            music.listMusic && (
                                <AudioPlayer
                                    className="player-music"
                                    src={music.listMusic[music.index].url}
                                    layout="stacked-reverse"
                                    showSkipControls={true}
                                    showJumpControls={false}
                                    onClickNext={handleClickNext}
                                    onClickPrevious={handleClickPrevious}
                                />
                            )
                        }
                    </>
                )
            }

        </footer>
    )
}
