import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { fetchCurrentStudent, updateReaction } from '../actions/current-student'
import Reaction from '../student-reaction'
import emojis from '../emojis.json'

const CurrentStudent = () => {
    const [currentTab, setCurrentTab] = useState(0)
    const dispatch = useDispatch()
    const student = useSelector(state => state.current_student)
    const socket = useSelector(state => state.socket)
    const users = student[emojis[currentTab].name]
    const usersList = useRef()

    useEffect(() => {
        dispatch(fetchCurrentStudent())
        socket.on('reaction', (data) => {
            dispatch(updateReaction(data))
        })
    }, [dispatch, socket])

    useEffect(() => {
        if (usersList.current) {
            usersList.current.scrollTop = usersList.current.scrollHeight
        }
    }, [student])

    return (
        <React.Fragment>
            {console.log('CurrentStudent')}
            {student.index && <div className={styles.current_student}>
                <div className={styles.student}>
                    <img className={styles.image} src={`https://${student.event_id}.s3.us-east-2.amazonaws.com/${student.name}.jpg`} alt='student' />
                    <p className={styles.name}>{student.name}</p>
                    <p className={styles.degree}>{student.degree}</p>
                    <div className={styles.reactions}>
                        {emojis.map(({ name, emoji }, i) => {
                            return (
                                <div key={i} className={`${styles.reaction} ${i === currentTab && styles.current_tab}`} onClick={() => setCurrentTab(i)}>
                                    <span className={styles.emoji} role='img' aria-label={name}>{emoji}</span>
                                    <p className={styles.count}>{student[name]?.length || 0}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
                {users && <div className={styles.users} ref={usersList}>
                    {users.map((user, i) => {
                        return <span key={i}>{user}{student[emojis[currentTab].name].length !== i + 1 && ', '}</span>
                    })}
                </div>}
                <Reaction studentId={student.index} />
            </div>}
        </React.Fragment>
    )
}

export default React.memo(CurrentStudent)