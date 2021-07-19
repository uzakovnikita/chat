import { Component } from "react";
import { ShallowWrapper } from "enzyme";


export const findByTestAttr = (component: ShallowWrapper<any, Readonly<{}>, Component<{}, {}, any>>, attr: string) => component.find(`[data-test='${attr}']`);