import { AnswerType } from '../questions.base';
import React from 'react';

type SupportBlockElement = {
    block: string;
}

const CreateAnswer = ({answer, level, block}: AnswerType & SupportBlockElement) => {
    return (
        <div className="flex items-center">
        <input type="radio" checked={answer === answer} value={answer} name={level+block} className="w-4 h-4 text-blue-600"/>
        <label className="ml-2 text-sm font-medium">{answer}</label>
    </div>
    )
}

export default CreateAnswer;