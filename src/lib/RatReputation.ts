import { readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

interface ImageReputation {
    rat: string[];
    notRat: string[];
}

type ReputationData = Record<string, ImageReputation>;

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'rat-reputation.json');

export class RatReputation {
    private static instance: RatReputation;
    private data: ReputationData = {};
    private loaded = false;

    constructor() {
        if (RatReputation.instance) {
            return RatReputation.instance;
        }

        RatReputation.instance = this;
    }

    private async load(): Promise<void> {
        if (this.loaded) {
            return;
        }

        if (!existsSync(DATA_DIR)) {
            await mkdir(DATA_DIR, { recursive: true });
        }

        if (existsSync(DATA_FILE)) {
            const raw = await readFile(DATA_FILE, 'utf-8');

            this.data = JSON.parse(raw);
        }

        this.loaded = true;
    }

    private async save(): Promise<void> {
        await writeFile(DATA_FILE, JSON.stringify(this.data, null, 2));
    }

    public async vote(imageId: string, userId: string, isRat: boolean): Promise<'recorded' | 'switched' | 'duplicate'> {
        await this.load();

        if (!this.data[imageId]) {
            this.data[imageId] = { rat: [], notRat: [] };
        }

        const entry = this.data[imageId];
        const addTo = isRat ? entry.rat : entry.notRat;
        const removeFrom = isRat ? entry.notRat : entry.rat;

        if (addTo.includes(userId)) {
            return 'duplicate';
        }

        const switchIndex = removeFrom.indexOf(userId);
        let result: 'recorded' | 'switched';

        if (switchIndex !== -1) {
            removeFrom.splice(switchIndex, 1);
            result = 'switched';
        } else {
            result = 'recorded';
        }

        addTo.push(userId);
        await this.save();

        return result;
    }

    public async isBadImage(imageId: string): Promise<boolean> {
        await this.load();

        const entry = this.data[imageId];

        if (!entry) {
            return false;
        }

        return entry.notRat.length >= 5 && entry.notRat.length > entry.rat.length * 3;
    }
}
