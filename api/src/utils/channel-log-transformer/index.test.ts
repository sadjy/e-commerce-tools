import { ChannelLogTransformer, IPayload } from '.';
import { ChannelData, ChannelLog } from '../../models/types/channel-data';
import { StreamsMessage } from '../../services/streams-service';

describe('test ChannelLogTransformer', () => {
	it('streamsdata should return expected channel logs', async () => {
		const expectedChannelLogs: ChannelData[] = [
			{
				link: '92a2cdc1d03eebcc6d46dbbbe41ff3e9d7a8b7971da61f128662ba54d10a454e0000000000000000:8232661d2ac553604189fff6',
				messageId: 'a9cad6a23fc630255446e482b59dead3b9415ff0adb4a00302450cc683982a43',
				channelLog: {
					created: '2021-08-17T14:05:40+02:00',
					type: 'author-test',
					metadata: {
						somedata: 2
					},
					publicPayload: {
						publicData: 'testdata12'
					},
					payload: {
						x: 'I am also a payload from the author 22'
					}
				}
			}
		];

		const streamsMessages: StreamsMessage[] = [
			{
				link: '92a2cdc1d03eebcc6d46dbbbe41ff3e9d7a8b7971da61f128662ba54d10a454e0000000000000000:8232661d2ac553604189fff6',
				messageId: 'a9cad6a23fc630255446e482b59dead3b9415ff0adb4a00302450cc683982a43',
				maskedPayload: {
					data: { x: 'I am also a payload from the author 22' }
				},
				publicPayload: {
					created: '2021-08-17T14:05:40+02:00',
					type: 'author-test',
					metadata: {
						somedata: 2
					},
					data: { publicData: 'testdata12' }
				}
			}
		];

		const channelLogs = ChannelLogTransformer.transformStreamsMessages(streamsMessages);
		expect(channelLogs).toEqual(expectedChannelLogs);
	});

	it('streamsdata should return expected channel logs for undefined payloads', async () => {
		const expectedChannelLogs: ChannelData[] = [
			{
				link: '92a2cdc1d03eebcc6d46dbbbe41ff3e9d7a8b7971da61f128662ba54d10a454e0000000000000000:8232661d2ac553604189fff6',
				messageId: 'a9cad6a23fc630255446e482b59dead3b9415ff0adb4a00302450cc683982a43',
				channelLog: {
					created: undefined,
					type: undefined,
					metadata: undefined,
					publicPayload: undefined,
					payload: undefined
				}
			}
		];

		const streamsMessages: StreamsMessage[] = [
			{
				link: '92a2cdc1d03eebcc6d46dbbbe41ff3e9d7a8b7971da61f128662ba54d10a454e0000000000000000:8232661d2ac553604189fff6',
				messageId: 'a9cad6a23fc630255446e482b59dead3b9415ff0adb4a00302450cc683982a43',
				maskedPayload: null,
				publicPayload: null
			}
		];

		const channelLogs = ChannelLogTransformer.transformStreamsMessages(streamsMessages);
		expect(channelLogs).toEqual(expectedChannelLogs);
	});

	it('streamsdata should return empty logs for empty messages array', async () => {
		const expectedChannelLogs: ChannelData[] = [];
		const streamsMessages: StreamsMessage[] = [];
		const channelLogs = ChannelLogTransformer.transformStreamsMessages(streamsMessages);
		expect(channelLogs).toEqual(expectedChannelLogs);
	});

	it('streamsdata should return empty logs for messages=null', async () => {
		const expectedChannelLogs: ChannelData[] = [];
		const streamsMessages: StreamsMessage[] = null;
		const channelLogs = ChannelLogTransformer.transformStreamsMessages(streamsMessages);
		expect(channelLogs).toEqual(expectedChannelLogs);
	});

	it('channel logs should return expected payloads', async () => {
		const channelLog: ChannelLog = {
			created: '2021-08-17T14:05:40+02:00',
			type: 'author-test',
			metadata: {
				somedata: 2
			},
			publicPayload: {
				publicData: 'testdata12'
			},
			payload: {
				x: 'I am also a payload from the author 22'
			}
		};

		const publicPayload: IPayload = {
			created: '2021-08-17T14:05:40+02:00',
			type: 'author-test',
			metadata: {
				somedata: 2
			},
			data: { publicData: 'testdata12' }
		};
		const maskedPayload: IPayload = {
			data: { x: 'I am also a payload from the author 22' }
		};
		const payloads = ChannelLogTransformer.getPayloads(channelLog);
		expect(payloads).toEqual({ maskedPayload, publicPayload });
	});

	it('channel logs should return all data in encrypted payloads but created and type in public', async () => {
		const channelLog: ChannelLog = {
			created: '2021-08-17T14:05:40+02:00',
			type: 'author-test',
			payload: {
				x: 'I am also a payload from the author 22'
			}
		};

		const publicPayload: IPayload = { created: '2021-08-17T14:05:40+02:00', type: 'author-test' };
		const maskedPayload: IPayload = {
			data: { x: 'I am also a payload from the author 22' }
		};
		const payloads = ChannelLogTransformer.getPayloads(channelLog);
		expect(payloads).toEqual({ maskedPayload, publicPayload });
	});

	it('channel logs should return empty payloads', async () => {
		const channelLog: ChannelLog = null;

		const publicPayload: IPayload = {};
		const maskedPayload: IPayload = {};
		const payloads = ChannelLogTransformer.getPayloads(channelLog);
		expect(payloads).toEqual({ maskedPayload, publicPayload });
	});
});
