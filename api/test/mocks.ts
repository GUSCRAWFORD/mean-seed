import { spy } from 'sinon';
export class MockReqHandler {
    post = spy();
    get = spy();
    put = spy();
}
export class MockApp extends MockReqHandler {
    static instance = new MockApp();
    Router() {
        return new MockRouter();
    }
}
export class MockExpress {
    static instance = new MockExpress();
    express () {
        return MockApp.instance;
    }
}
export class MockRouter extends MockReqHandler {

}