import { QuestionsBaseType } from '../questions.base';
import CreateQuestion from './create.question';
import React from 'react';

const CreateBlock = ({block, questions}: QuestionsBaseType) => {
    return (
        <div className="container px-5 mx-auto">
            <h1 className="flex-grow sm:pr-16 text-2xl font-medium title-font mb-4 mt-4">
                <i>{block}</i>
            </h1>
            {
                questions && questions.map((value, index) => {
                    return <CreateQuestion
                        key={value.question + index}
                        index={index}
                        question={value.question}
                        answers={value.answers}
                    />
                })
            }
        </div>
    )
}

export default CreateBlock;