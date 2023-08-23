import React, {FormEvent, useEffect, useState} from 'react';
import { Header } from '../layout/header';
import {QuestionsBase} from './questions.base'
import CreateBlock from './components/create.block';

const Form = () => {
    const [result, setResult] = useState(0);


    const submitHandlerReset = () => {
        setResult(0);
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault();
        let nodes = e.target;

        let sumOfLevels = 0;
        Object.keys(nodes).map((item,ix) => {
            let node = (nodes as any)[ix];
            if (node?.checked && node?.attributes) {
                for (const attr of node.attributes) {
                    if (attr.name === 'id') {
                        sumOfLevels += parseInt(attr.value)+1;
                    }
                }
            }
        });
        const finalValue = (sumOfLevels / 11).toFixed(2);
        console.log(+finalValue, sumOfLevels / 11);
        setResult(+finalValue);
    }

    return (
        <div className="2xl:max-w-[90rem] max-w-[68rem] mx-auto pb-10">
            <div className="px-3 py-10 text-center">
                <Header
                    title={'Анкета компетенции исполнителя'}
                    description={'На данной странице Вы может пройти небольшую анкету, ' +
                        'чтобы узнать результат компетенции исполнителя.'}
                />
            </div>

            <section className="text-gray-600 body-font bg-white rounded-lg">
                <div className="container px-5 py-10 mx-auto flex flex-wrap">
                    <div className="sm:w-3/3 mx-auto">
                        <form onSubmit={(e) => submitHandler(e)}>
                            {
                                QuestionsBase && QuestionsBase.map(item => {
                                    return <CreateBlock
                                        key={item.block}
                                        questions={item.questions}
                                        block={item.block}
                                    />
                                })
                            }

                            <div className="justify-center">
                                {
                                    result === 0 && (
                                        <button
                                            // onClick={submitHandler}
                                            className="flex mx-auto mt-14 text-white bg-indigo-500 border-0 py-2 px-8 rounded text-lg"
                                            type="submit"
                                        >Сделать расчет
                                        </button>
                                    )
                                }
                                {
                                    result > 0 && (
                                        <button
                                            onClick={submitHandlerReset}
                                            className="flex mx-auto mt-14 text-white bg-sky-500 border-0 py-2 px-8 rounded text-lg"
                                            type="submit"
                                        >Попробовать ещё
                                        </button>
                                    )
                                }
                            </div>
                        </form>

                        { result > 0 &&
                            <div style={{justifyContent: 'center'}} className="mt-10 bg-gray-100 rounded flex p-4 items-center">
                                <span className="title-font font-medium">Показатель компетенции по итогам расчета составляет {result}</span>
                            </div>
                        }
                    </div>


                </div>

            </section>
        </div>
    )
}

function SingleForm() {
    return <Form/>
}

export default SingleForm;
