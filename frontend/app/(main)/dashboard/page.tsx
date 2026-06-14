'use client';

import { ReactNode, useCallback, useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/** lib */
import { useDataStore } from '@/common/lib/store/useDataStore';
import { format as echartFormat } from 'echarts';

/** Custom */
import { cheongan } from '@/common/const/cheonganConst';
import { ohaeng } from '@/common/const/ohaengConst';
import { jiji } from '@/common/const/jijiConst';

import { calculateCurrentDaeun } from '@/common/util/commonFunc';
import { makeBgColor, defaultTextColor, makeColorName } from '@/common/util/colorFunc';

import EchartComp from '@/common/lib/EchartComp';
import ElementBoxComp from '@/common/component/ElementBoxComp';
import AsideContents from '@/common/component/AsideContents';
import TooltipComp from '@/common/component/TooltipComp';
import TooltipIconComp from '@/common/component/TooltipIconComp';

/** type & interface*/
import { OhaengType } from '@/common/type/basicType';
import { OhaengStrengthEachData } from '@/common/type/ohaengDataInterface';
import { YearListData } from '@/common/type/luckyDataInterface';
import { OheangChangeInterface } from '@/client/ohaengDataService';

const SmallContents = ({ title, children }: { title: string; children: ReactNode }) => {
    return (
        <div className="flex flex-1 flex-col w-full min-h-30 py-2 px-4 border rounded-2xl">
            <div className="text-sm font-bold py-1 px-1 border-b border-dashed">{title}</div>
            <div className="flex-1 flex justify-center items-center w-full">{children}</div>
        </div>
    );
};

export default function DashboardPage() {
    const router = useRouter();
    const profileData = useDataStore((state) => state.profileData);
    const data = useDataStore((state) => state.data);

    const [elementListData, setElementListData] = useState<OhaengStrengthEachData[]>(
        () => data?.ohaengStrength.ohaeng ?? [],
    );

    const [needOhaeng, setNeedOhaeng] = useState<OhaengType[]>(() => data?.needOhaeng ?? []);

    const [yearEleListData, setYearEleListData] = useState<YearListData[]>(
        () => data?.yearOhaeng ?? [],
    );

    const onChangeAdjustScore = useCallback((adjustData: OheangChangeInterface) => {
        setElementListData(adjustData.ohaengStrength.ohaeng);
        setNeedOhaeng(adjustData.needOhaeng);
    }, []);

    const elementChartData = useMemo(() => {
        const indicatorDefault = ['목', '수', '금', '토', '화'];
        const indicatorList: number[] = [];
        elementListData.forEach((item) => {
            indicatorDefault.forEach((indicatorItem, indicatorIdx) => {
                if (indicatorItem === item.element) {
                    indicatorList[indicatorIdx] = item.percent;
                }
            });
        });

        return {
            radar: {
                radius: '75%',
                center: ['50%', '55%'],
                indicator: indicatorDefault.map((item) => ({ name: item, max: 100 })),
            },
            series: [
                {
                    type: 'radar',
                    data: [
                        {
                            value: indicatorList,
                        },
                    ],
                },
            ],
        };
    }, [elementListData]);

    const sipsinChartData = useMemo(() => {
        const indicatorDefault = ['비겁', '식상', '재성', '인성', '관성'];
        const indicator1List: any[] = [];
        const indicator2List: any[] = [];

        elementListData.forEach((item) => {
            const sipsinList = item.sipsinDataList;

            indicatorDefault.forEach((indicatorItem, indicatorIdx) => {
                if (indicatorItem === item.sipsinGroup) {
                    indicator1List[indicatorIdx] = {
                        name: sipsinList[0].name,
                        value: sipsinList[0].percent,
                    };
                    indicator2List[indicatorIdx] = {
                        name: sipsinList[1].name,
                        value: sipsinList[1].percent,
                    };
                }
            });
        });

        return {
            legend: {
                show: false,
            },
            grid: [
                {
                    top: 16,
                    bottom: 32,
                },
            ],
            tooltip: {
                formatter: (params: any[]) => {
                    let str = `<div class="flex flex-col gap-1"> <div class=" font-bold">${params[0].axisValueLabel}</div>`;
                    params.forEach((element) => {
                        str +=
                            '<div class="flex flex-row justify-start items-center">' +
                            element.marker +
                            echartFormat.encodeHTML(element.name) +
                            '<b class="ml-3">' +
                            echartFormat.encodeHTML(element.value + '%') +
                            '</b>' +
                            '</div>';
                    });

                    str += '</div>';
                    return str;
                },
            },
            yAxis: {
                type: 'category',
                data: indicatorDefault,
            },
            series: [
                {
                    name: 'sipsin1',
                    type: 'bar',
                    stack: 'total',
                    barWidth: 16,
                    data: indicator1List,
                    showBackground: true,
                },
                {
                    name: 'sipsin2',
                    type: 'bar',
                    stack: 'total',
                    data: indicator2List,
                },
            ],
        };
    }, [elementListData]);

    const yearChartData = useMemo(() => {
        const option = {
            color: ['#65b276', '#e06b62', '#eebf4d', '#d4d4d4', '#454545'],
            grid: { top: 0, bottom: '35%', left: '5%', right: '2%' },
            tooltip: {
                triggerOn: 'none',
            },
            yAxis: {
                type: 'value',
            },
            xAxis: {
                type: 'category',
                data: yearEleListData.map((item) => String(item.year)),
                axisPointer: {
                    value: '2026',
                    snap: true,
                    label: {
                        show: true,
                        backgroundColor: '#56b39a',
                    },
                    handle: {
                        show: true,
                        size: 20,
                        margin: 35,
                        color: '#56b39a',
                    },
                },
            },
            series: elementListData.map((item) => ({
                name: item.element,
                type: 'bar',
                stack: 'total',
                barWidth: '20%',
                data: yearEleListData.map((yearItem) => {
                    const daeGanEle = cheongan[yearItem.daeunGan].element;
                    const daeJiEle = jiji[yearItem.daeunJiji].element;
                    const seGanEle = cheongan[yearItem.seunGan].element;
                    const seJiEle = jiji[yearItem.seunJiji].element;

                    let per = item.percent * 0.6;
                    if (daeGanEle === item.element) per += 50 * 0.25;
                    if (daeJiEle === item.element) per += 50 * 0.25;
                    if (seGanEle === item.element) per += 50 * 0.15;
                    if (seJiEle === item.element) per += 50 * 0.15;

                    return per;
                }),
            })),
        };

        return option;
    }, [yearEleListData, elementListData]);

    const smallContList = useMemo(() => {
        const targetDaeun =
            profileData && data ? calculateCurrentDaeun(profileData, data.daeun) : null;

        let overElement = elementListData.filter((item) => item.standard === '과다');
        if (overElement.length === 0) {
            overElement =
                elementListData.length > 0
                    ? [
                          elementListData.reduce((prev, current) =>
                              prev.score > current.score ? prev : current,
                          ),
                      ]
                    : [];
        }
        return [
            {
                title: '사주 온도(조후)',
                children: (
                    <div>
                        <div className="relative group">
                            <span className="text-lg text-center font-extrabold">
                                {data?.ohaengTemp.name}
                            </span>
                            <TooltipComp>
                                <div className="flex flex-col justify-start">
                                    <div className="flex flex-row gap-2.5">
                                        <span>계절:</span>
                                        <span className="font-bold">{data?.ohaengTemp.season}</span>
                                    </div>
                                    <div className="flex flex-row gap-2.5">
                                        <span>시간: </span>
                                        <span className="font-bold">
                                            {data?.ohaengTemp.timeName}
                                        </span>
                                    </div>
                                </div>
                            </TooltipComp>
                        </div>
                    </div>
                ),
            },
            {
                title: '발달 오행',
                children: (
                    <div className="flex flex-row justify-center items-center gap-2">
                        {overElement.map((item) => (
                            <div
                                key={item.element}
                                className={`flex flex-row justify-center items-center w-16 h-16`}
                            >
                                {ohaeng[item.element].icon}
                            </div>
                        ))}
                    </div>
                ),
            },
            {
                title: '현재 대운',
                children: (
                    <div className="flex flex-row justify-center items-center gap-2">
                        {targetDaeun != null ? (
                            <>
                                <div className={`flex flex-row justify-center items-center`}>
                                    <ElementBoxComp
                                        name={targetDaeun.gan}
                                        type="gan"
                                        size="small"
                                    />
                                </div>
                                <div className={`flex flex-row justify-center items-center`}>
                                    <ElementBoxComp
                                        name={targetDaeun.jiji}
                                        type="jiji"
                                        size="small"
                                    />
                                </div>
                            </>
                        ) : (
                            <div>해당 대운이 없습니다.</div>
                        )}
                    </div>
                ),
            },
            {
                title: '신강/신약',
                children: (
                    <div className="text-lg text-center font-extrabold">
                        {data?.ohaengStrength.strengthType}
                    </div>
                ),
            },
        ];
    }, [data, elementListData, profileData]);

    // useEffect
    useEffect(() => {
        console.log(data);
        if (data === null || profileData === null) {
            router.push('/');
        }
    }, [data, profileData]);

    return (
        data && (
            <div className="flex flex-1 flex-col justify-start items-start w-full gap-4 p-8 md:flex-row md:items-stretch">
                <AsideContents
                    profileData={profileData}
                    className="md:w-1/3"
                    data={data}
                    onChangeScore={onChangeAdjustScore}
                >
                    <div className="flex flex-col w-full h-full p-4 ">
                        <div className="flex flex-row justify-start items-center w-full gap-4">
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-sm font-bold">필요한 오행</span>
                                <TooltipIconComp>
                                    <span>조후 + 십신 흐름에 따른 필요 오행</span>
                                </TooltipIconComp>
                            </div>
                            <ul className="flex flex-row gap-2">
                                {Array.from(needOhaeng).map((item, idx) => {
                                    return (
                                        <li
                                            key={idx}
                                            className="flex flex-row justify-center items-center w-10 h-10 "
                                        >
                                            {ohaeng[item].icon}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="flex flex-row justify-start items-center w-full gap-4">
                            <div className="flex flex-row items-center gap-1">
                                <span className="text-sm font-bold">잘맞는 일주</span>
                                <TooltipIconComp>
                                    <span>
                                        나의 일주 천간과 합이되는 천간, 일주 지지와 합이되거나 일주
                                        천간을 생하는 지지
                                    </span>
                                </TooltipIconComp>
                            </div>
                            <ul className="flex flex-row gap-2">
                                {data.point.compatibleSaju.map((item, idx) => {
                                    return (
                                        <li
                                            key={idx}
                                            className="flex flex-row justify-center items-center w-10 h-10"
                                        >
                                            <Image
                                                src={`/svg/character_head/${item}.svg`}
                                                width={38}
                                                height={38}
                                                alt={`${item} 동물 이미지`}
                                                style={{ zIndex: 2 }}
                                                unoptimized
                                            />
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                        <div className="mt-3 text-xs text-gray-400 dark:text-gray-700">
                            본 결과는 단식적인 해석으로 사주 원국 전체를 분석한 결과에 따라 달라질
                            수 있습니다.
                        </div>
                    </div>
                </AsideContents>
                <section className="flex flex-col w-full gap-4 md:w-2/3 ">
                    <article className="flex flex-row flex-1 w-full gap-4 ">
                        {smallContList.map((item: Record<string, any>, idx: number) => (
                            <SmallContents key={idx} title={item.title}>
                                {item.children}
                            </SmallContents>
                        ))}
                    </article>
                    <article className="flex flex-2 flex-row w-full gap-4 ">
                        <div className="flex flex-1 flex-row items-stretch min-h-32 p-4 gap-4 border rounded-2xl">
                            <ul className="flex flex-col justify-center items-center w-1/4 h-full py-2 border border-dashed rounded-2xl">
                                {data?.ohaengStrength.ohaeng.map((item, idx) => {
                                    return (
                                        <li
                                            key={idx}
                                            className="flex flex-row justify-center items-center w-7 h-7 "
                                        >
                                            {item.score
                                                ? ohaeng[item.element].icon
                                                : ohaeng[item.element].iconDisable}
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="w-3/4 h-full">
                                <EchartComp chartType={'radar'} option={elementChartData} />
                            </div>
                        </div>
                        <div className="flex flex-1 flex-row min-h-32 p-4 gap-4 border rounded-2xl">
                            <EchartComp chartType={'rank_bar'} option={sipsinChartData} />
                        </div>
                    </article>
                    <article className="flex flex-3 flex-col w-full min-h-48 p-4 gap-2 rounded-2xl border">
                        <div className="flex flex-col flex-1 w-full ">
                            <EchartComp chartType={'bar'} option={yearChartData} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-full pr-3 rounded-2xl ">
                            <div className="flex flex-row w-full border text-sm rounded-xl">
                                <div className="flex flex-col w-10 border-r">
                                    <div className="flex flex-row justify-center items-center p-1 border-b">
                                        대운
                                    </div>
                                    <div className="flex flex-row justify-center items-center p-1">
                                        세운
                                    </div>
                                </div>
                                {yearEleListData.map((yearItem, idx) => (
                                    <div
                                        key={yearItem.year}
                                        className={`flex flex-col flex-1 ${idx === yearEleListData.length - 1 ? '' : 'border-r'}`}
                                    >
                                        <div className="flex flex-row justify-center items-center p-1 border-b">
                                            <div
                                                className={`px-1 rounded-xl ${makeBgColor(makeColorName(yearItem.daeunGan, 'gan'))} ${defaultTextColor(makeColorName(yearItem.daeunGan, 'gan'))}`}
                                            >
                                                {yearItem.daeunGan}
                                            </div>
                                            <div
                                                className={`px-1 rounded-xl ${makeBgColor(makeColorName(yearItem.daeunJiji, 'jiji'))} ${defaultTextColor(makeColorName(yearItem.daeunJiji, 'jiji'))}`}
                                            >
                                                {yearItem.daeunJiji}
                                            </div>
                                        </div>
                                        <div className="flex flex-row justify-center items-center p-1">
                                            <div
                                                className={`px-1 rounded-xl ${makeBgColor(makeColorName(yearItem.seunGan, 'gan'))} ${defaultTextColor(makeColorName(yearItem.seunGan, 'gan'))}`}
                                            >
                                                {yearItem.seunGan}
                                            </div>
                                            <div
                                                className={`px-1 rounded-xl ${makeBgColor(makeColorName(yearItem.seunJiji, 'jiji'))} ${defaultTextColor(makeColorName(yearItem.seunJiji, 'jiji'))}`}
                                            >
                                                {yearItem.seunJiji}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        )
    );
}
