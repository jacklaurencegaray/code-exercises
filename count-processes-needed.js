/**
 * 
 * Problem: Given an array of integer intervals for a [starting, ending] point of a process,
 * determine how many processes are needed to run the entire processes.
 * 
 * [0, 50], [30, 100]
 * Output: 2
 * 
 * [0, 50], [30, 100], [60, 100]
 * Output: 2 because as soon as [60, 100] starts, [0, 50] has ended and you can reuse this same process. 
 * 
 * [0, 50], [30, 100], [60, 120], [60, 80], [70, 120], [100, 140]
 * Output: 4
 * 
 * [0, 50], [50, 100], [100, 150], [150, 200], [200, 250]]
 * Output: 1 for each interval, the other one starts after the previous ends, and you can reuse this same process all through out
 * 
 */

class PriorityQueue {
    constructor() {
        this.items = []
    }

    leftChild = index => index * 2 + 1
    rightChild = index => index * 2 + 2

    siftDown(index) {
        let childToSwap = null
        const [leftChild, rightChild] = [this.leftChild(index), this.rightChild(index)]

        if (leftChild < this.size() && this.items[leftChild].priority < this.items[index].priority) 
            childToSwap = leftChild

        if (rightChild < this.size() && this.items[rightChild].priority < (childToSwap === null? this.items[index].priority: this.items[childToSwap].priority)) 
            childToSwap = rightChild

        if (childToSwap) {
            this.swap(index, childToSwap)
            this.siftDown(childToSwap)
        }
    }

    dequeue() {
        if (!this.isEmpty()) {
            if (this.size() === 1) {
                return this.items.pop()
            } else {
                const firstItem = this.items[0]
                const lastItem = this.items.pop()
                this.items[0] = lastItem
                
                this.siftDown(0)
                return firstItem
            }
        }
    }

    enqueue(item) {
        this.items.push(item)
        this.heapifyUp(this.items.length - 1)
    }

    parent = (index) => Math.ceil(index / 2) - 1

    swap = (a, b) => {
        const oldA = this.items[a]
        this.items[a] = this.items[b]
        this.items[b] = oldA
    }

    heapifyUp(index) {
        let parentIndex = this.parent(index)

        while (parentIndex >= 0 && this.items[index].priority < this.items[parentIndex].priority) {
            this.swap(index, parentIndex)
            parentIndex = this.parent(index)
        }
    }

    peek = () => this.items[0]
    size = () => this.items.length
    isEmpty = () => this.items.length === 0
}

/**
 * 
 * Given the following intervals:
 * { [0, 50], [30, 100] } output = 2
 * { [0, 50], [30, 100], [60, 100] } output = 2
 * { [0, 50], [30, 100], [60, 120], [60, 100], [70, 120] } output = 4
 * { [0, 50], [50, 100], [100, 150], [150, 200] } output = 1
 * 
 */

const maxNumberOfProcesses = (nums) => {
    const sortedNums = nums.sort((a, b) => a[0] - b[0])
    const queue = new PriorityQueue()
    let maximumProcesses = 0
    
    let circuitbreak = 0
    for (let [start, end] of sortedNums) {
        while (queue.peek() && queue.peek().priority <= start) {
            queue.dequeue()
        }

        queue.enqueue({ priority: end, value: [start, end] })
        maximumProcesses = Math.max(maximumProcesses, queue.items.length)

        circuitbreak++
        if (circuitbreak > 10)
            return
    }

    return maximumProcesses
}

const testCases = [
    [[[0, 50], [30, 100]], 2],
    [[[0, 50], [30, 100], [60, 100]], 2],
    [[[0, 50], [30, 100], [60, 120], [60, 80], [70, 120], [100, 140]], 4],
    [[[0, 50], [50, 100], [100, 150], [150, 200], [200, 250]], 1]
]

/**
 * 
 * ----------------
 *          ----------------------
 *                   -------
 *                      ----------------
 *                                ------------
 * -----------------------------------------------
 * 0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15
 */

testCases.forEach(([nums, expectedOutput]) => {
    const result = maxNumberOfProcesses(nums)
    if (expectedOutput !== result)
        throw new Error(`Test error occurred. Input: ${nums}, expected: ${expectedOutput}, received: ${result}`)
})