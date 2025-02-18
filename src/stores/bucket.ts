import { defineStore } from 'pinia'

type BucketStateProps = {
  buckets: BucketProps[]
  pinnedBuckets: BucketProps[]
}

type BucketProps = {
  _id: string
  title: string
  isPinned: boolean
  createdAt: string
  updatedAt: string
}

export const useBucketStore = defineStore('bucket', {
  state: () =>
    ({
      buckets: [],
      pinnedBuckets: [],
    }) as BucketStateProps,
  persist: true,
  actions: {
    updatedBuckets(buckets: BucketProps[]) {
      this.buckets = buckets
    },
    updatedPinnedBuckets(buckets: BucketProps[]) {
      this.pinnedBuckets = buckets
    },
  },
})
