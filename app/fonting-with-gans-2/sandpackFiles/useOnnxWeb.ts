import { InferenceSession } from "onnxruntime-web";

const defaultInitOpts: InferenceSession.SessionOptions = {
  executionProviders: ["webgl"],
  graphOptimizationLevel: "all",
};

type Sessions = { [key: string]: Promise<InferenceSession> | undefined };

const sessions: Sessions = {};

export const useOnnxWeb = (model: string) => {
  let session = sessions[model];

  const init = async (options = defaultInitOpts) => {
    if (!session) {
      sessions[model] = InferenceSession.create(model, options);
      return sessions[model];
    }
  };

  const run = async (
    feeds: InferenceSession.OnnxValueMapType,
    options?: InferenceSession.RunOptions
  ) => {
    if (session) {
      const sess = await session;
      return PromiseQueue.enqueue(() => sess.run(feeds, options));
    } else {
      console.warn("no session initialized");
    }
  };

  const release = async () => {
    if (session) {
      const sess = await session;
      return sess.release().then(() => {
        session = undefined;
      });
    } else {
      console.warn("no session to release");
    }
  };

  return { init, run, release, session };
};

type ReturnType = InferenceSession.OnnxValueMapType;

type QueueItem = {
  promise: () => Promise<ReturnType>;
  resolve: (value: ReturnType) => void;
  reject: (value: unknown) => void;
};

class PromiseQueue {
  static queue: QueueItem[] = [];
  static workingOnPromise = false;
  static stop = false;

  static enqueue: (promise: () => Promise<ReturnType>) => Promise<ReturnType> =
    (promise) => {
      return new Promise((resolve, reject) => {
        this.queue.push({
          promise,
          resolve,
          reject,
        });
        this.dequeue();
      });
    };

  static dequeue() {
    if (this.workingOnPromise) {
      return false;
    }

    if (this.stop) {
      this.queue = [];
      this.stop = false;
      return;
    }

    const item = this.queue.shift();

    if (!item) {
      return false;
    }

    try {
      this.workingOnPromise = true;
      item
        .promise()
        .then((value) => {
          this.workingOnPromise = false;
          item.resolve(value);
          this.dequeue();
        })
        .catch((err) => {
          this.workingOnPromise = false;
          item.reject(err);
          this.dequeue();
        });
    } catch (err) {
      this.workingOnPromise = false;
      item.reject(err);
      this.dequeue();
    }

    return true;
  }
}
