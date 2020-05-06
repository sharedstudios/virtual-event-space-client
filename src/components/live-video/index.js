import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css'
import Vimeo from '@vimeo/player'
import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGraduate } from '../actions/graduates'
import { sendVideoReaction } from '../actions/event'
import timeStamp from '../time-stamps.json'
import clapping from './clapping.png'
import heart from './heart.png'
import star_face from './star_face.png'
import Eye from './eye-svg'

const LiveVideo = () => {
    const iframe = useRef()
    const graduates = useSelector(state => state.graduates)
    const viewers = useSelector(state => state.event.viewers)
    const emojis = useSelector(state => state.event.emojis)
    const video_offset = useSelector(state => state.event.video_offset)
    const video_url = useSelector(state => state.event.video_url)
    const dispatch = useDispatch()

    useEffect(() => {
        let interval = null

        const player = new Vimeo(iframe.current, { url: video_url, width: 800 })
        player.on('play', () => interval = setInterval(() => player.getCurrentTime().then(checkTimeStamp), 1000))
        player.on('pause', () => clearInterval(interval))
        const checkTimeStamp = (seconds) => {
            // const hours = moment.duration(seconds, 'seconds').hours()
            // const minute = moment.duration(seconds, 'seconds').minutes()
            // const second = moment.duration(seconds, 'seconds').seconds()
            // console.log(`${hours}:${minute}:${second}`)

            timeStamp.forEach(({ time_stamp, type, id, segment_id }, i) => {
                let itemTimeStamp = moment.duration(time_stamp)
                const currentTimeStamp = Math.round(moment.duration(seconds, 'seconds').asSeconds())
                let segmentStarted = true
                if (segment_id && video_offset[segment_id] && video_offset[segment_id] > 0) {
                    itemTimeStamp.add(video_offset[segment_id], 's')
                    // const hours = itemTimeStamp.hours()
                    // const minute = itemTimeStamp.minutes()
                    // const second = itemTimeStamp.seconds()
                    // console.log({ id, segment_id, video_offset: video_offset[segment_id], time: `${hours}:${minute}:${second}` })
                    console.log('segment started:', segmentStarted)
                } else {
                    segmentStarted = false
                    console.log('segment started:', segmentStarted)
                }

                itemTimeStamp = Math.round(itemTimeStamp.asSeconds())

                if (segmentStarted && currentTimeStamp === itemTimeStamp) {
                    if (type === 'diploma') dispatch(fetchGraduate(id))
                    if (type === 'diploma-over') {
                        clearInterval(interval)
                        console.log('Interval cleared')
                        setTimeout(() => dispatch({ type: 'EMPTY-GRADUATE' }), 8000);
                    }
                    // console.log('item:', { time_stamp, type, id })
                }
            })
        }
        player.play()
        return () => clearInterval(interval)
    }, [dispatch, video_offset, video_url])

    return <div className={styles.live_video} ref={iframe} >
        <div className={styles.viewers}><Eye /> {viewers}</div>
        {Object.keys(graduates).length === 0 && <div className={styles.live_video_reaction}>
            <button className={styles.emoji} onClick={() => dispatch(sendVideoReaction('clapping'))}>
                {emojis?.clapping || 0}<img className={styles.emoji_image} alt='' src={clapping} />
            </button>
            <button className={styles.emoji} onClick={() => dispatch(sendVideoReaction('heart'))}>
                {emojis?.heart || 0}<img className={styles.emoji_image} alt='' src={heart} />
            </button>
            <button className={styles.emoji} onClick={() => dispatch(sendVideoReaction('star_face'))}>
                {emojis?.star_face || 0}<img className={styles.emoji_image} alt='' src={star_face} />
            </button>
        </div>}
    </div>
}

export default React.memo(LiveVideo)


    // < a href = "https://twitter.com/intent/tweet?button_hashtag=msmAlumni&ref_src=twsrc%5Etfw" class="twitter-hashtag-button" data - show - count="false" > Tweet #msmAlumni</a > <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>