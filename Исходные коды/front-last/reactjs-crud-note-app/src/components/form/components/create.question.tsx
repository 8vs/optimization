import { QuestionType } from '../questions.base';
import CreateAnswer from './create.answer';
import React, {useState} from 'react';

type SupportIndexElement = {
    index: number;
}

const CreateQuestion = ({question, answers, index}: QuestionType & SupportIndexElement) => {
    const [currentAnswer, setCurrentAnswer] = useState('');

    const handlerQuestion = (answer: string) => {
        setCurrentAnswer(answer);
    }

    return (
        <div className="flex-grow ml-4">
            <h2 className="text-gray-900 text-lg title-font font-medium mt-4 mb-2">{index + 1}. {question}</h2>
            {
                answers && answers.map(item => {
                    if (currentAnswer.length === 0) {
                        setCurrentAnswer(item.answer);
                    }

                    return (
                        <div className="flex items-center">
                            <input
                                type="radio" onClick={() => handlerQuestion(item.answer)}
                                   checked={currentAnswer === item.answer}
                                value={item.answer}
                                id={''+item.level}
                                className="w-4 h-4 text-blue-600"
                            />
                            <label className="ml-2 text-sm font-medium">{item.answer}</label>
                        </div>
                    )
                    // return <CreateAnswer block={question} key={item.answer} answer={item.answer} level={item.level}/>
                })
            }
        </div>
    )
}

export default CreateQuestion;