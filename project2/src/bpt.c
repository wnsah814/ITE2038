#include "bpt.h"

H_P * hp;

page * rt = NULL; //root is declared as global

int verbose = 1;

// file descriptor 
int fd = -1; //fd is declared as global

H_P * load_header(off_t off) {
    H_P * newhp = (H_P*)calloc(1, sizeof(H_P));
    if (sizeof(H_P) > pread(fd, newhp, sizeof(H_P), 0)) {
        return NULL;
    }
    return newhp;
}

page * load_page(off_t off) {
    page* load = (page*)calloc(1, sizeof(page));
    //if (off % sizeof(page) != 0) if (verbose) printf("load fail : page offset error\n");
    if (sizeof(page) > pread(fd, load, sizeof(page), off)) {
        return NULL;
    }
    return load;
}

int open_table(char * pathname) {
    fd = open(pathname, O_RDWR | O_CREAT | O_EXCL | O_SYNC, 0775);
    hp = (H_P *)calloc(1, sizeof(H_P));

    // 파일이 존재하지 않아 새로 만드는 경우
    if (fd > 0) {
        if (verbose) printf("New File created\n");
        hp->fpo = 0;
        hp->num_of_pages = 1;
        hp->rpo = 0;
        pwrite(fd, hp, sizeof(H_P), 0);
        // 불필요한 IO
        // free(hp);
        // hp = load_header(0);
        return 0;
    }
    fd = open(pathname, O_RDWR|O_SYNC);
    // 이미 파일이 존재하는 경우
    if (fd > 0) {
        if (verbose) printf("Read Existed File\n");
        if (sizeof(H_P) > pread(fd, hp, sizeof(H_P), 0)) {
            return -1;
        }
        off_t r_o = hp->rpo;
        rt = load_page(r_o);
        return 0;
    }
    else return -1;
}

// page를 리셋한다
void reset(off_t off) {
    page * reset;
    reset = (page*)calloc(1, sizeof(page));
    reset->parent_page_offset = 0;
    reset->is_leaf = 0;
    reset->num_of_keys = 0;
    reset->next_offset = 0;
    pwrite(fd, reset, sizeof(page), off);
    free(reset);
    return;
}

/// @brief free to use
/// @param fpo free page offset
void freetouse(off_t fpo) {
    page * reset;
    reset = load_page(fpo);
    reset->parent_page_offset = 0;
    reset->is_leaf = 0;
    reset->num_of_keys = 0;
    reset->next_offset = 0;
    pwrite(fd, reset, sizeof(page), fpo);
    free(reset);
    return;
}

/// @brief use to free
/// @param wbf will be free
void usetofree(off_t wbf) {
    page * utf = load_page(wbf);
    utf->parent_page_offset = hp->fpo;
    utf->is_leaf = 0;
    utf->num_of_keys = 0;
    utf->next_offset = 0;
    pwrite(fd, utf, sizeof(page), wbf);
    free(utf);
    hp->fpo = wbf;
    pwrite(fd, hp, sizeof(hp), 0);
    free(hp);
    hp = load_header(0);
    return;
}

/// @brief make new page
/// @return page offset
off_t new_page() {
    off_t newp;
    page * np;
    off_t prev;
    if (hp->fpo != 0) {
        newp = hp->fpo;
        np = load_page(newp);
        hp->fpo = np->parent_page_offset;
        pwrite(fd, hp, sizeof(hp), 0);
        free(hp);
        hp = load_header(0);
        free(np);
        freetouse(newp);
        return newp;
    }
    //change previous offset to 0 is needed
    newp = lseek(fd, 0, SEEK_END);
    //if (newp % sizeof(page) != 0) if (verbose) printf("new page made error : file size error\n");
    reset(newp);
    hp->num_of_pages++;
    pwrite(fd, hp, sizeof(H_P), 0);
    free(hp);
    hp = load_header(0);
    return newp;
}

/// @brief internal page에서 key값을 찾는다
/// @param p internal page
/// @param key key to find
/// @return internal page에서 다음 노드의 index값
int find_index_in_internal(page* p, int64_t key) {
    int start = 0;
    int end = p -> num_of_keys - 1;
    int mid;
    int64_t ref;
    while (start <= end) {
        mid = (start + end) / 2;
        ref = p -> b_f[mid].key;
        if (ref == key) {
            return mid;
        } else if (ref < key) {
            start = mid + 1;
        } else {
            end = mid - 1;
        }
    }
    return end;
}

/// @brief find the leaf page that contains the key
/// @param key the key to find
/// @return offset of the page that contains the key, 0 if not exists
off_t find_leaf(int64_t key) {
    page * p;
    off_t loc = hp->rpo;

    if (verbose) {
        printf("[Find Leaf] finding key = %ld\n", key);
        //, left = %ld, key = %ld, right = %ld, is_leaf = %d, now_root = %ld\n", key, rt->next_offset, rt->b_f[0].key, rt->b_f[0].p_offset, rt->is_leaf, hp->rpo);
        page * rootp = load_page(hp -> rpo);
        if (rootp -> is_leaf) {
            for (int i= 0; i < rootp->num_of_keys; ++i) {
                printf("%d %ld\n", i, rootp -> records[i].key);
            }
        } else {
            for (int i= 0; i < rootp->num_of_keys; ++i) {
                printf("%d %ld\n", i, rootp -> b_f[i].key);
            }
        }
        free(rootp);
    }

    if (rt == NULL) {
        if (verbose) printf("Empty tree.\n");
        return 0;
    }
    p = load_page(loc);

    // binary search 를 이용해 leaf node까지 접근한다.
    while (!p->is_leaf) {
        // i = 0;
        int index = find_index_in_internal(p, key);
        if (index == -1) {
            loc = p -> next_offset;
        } else {
            loc = p -> b_f[index].p_offset;
        }
        if (verbose) printf("index: %d, loc: %ld\n", index, loc);
        free(p);
        p = load_page(loc);
    }

    free(p);
    return loc;
}

/// @brief find the key in the tree and returns value of the key if the key exits
/// @param key the key to find
/// @return value of the key, NULL if not exits
char * db_find(int64_t key) {
    char * value = (char*)malloc(sizeof(char) * 120);
    int i = 0;

    // key를 포함하는 lead node를 찾는다
    off_t fin = find_leaf(key);
    // 존재하지 않는 경우 NULL 을 리턴한다
    if (fin == 0) {
        return NULL;
    }

    // find_leaf 를 통해 찾은 노드를 읽어온다
    page * p = load_page(fin);

    // binary search
    int left = 0;
    int right = p -> num_of_keys - 1;
    int mid;
    int64_t ref;
    while (left <= right) {
        mid = (left + right) / 2;
        ref = p -> records[mid].key;
        if (key == ref) {
            strcpy(value, p->records[mid].value);
            free(p);
            return value;
        } else if (ref < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    // 존재하지 않는 경우
    free(p);
    return NULL;
    if (mid == p->num_of_keys) {
    } 
}

// 부모로 올라갈 레코드 번호
int cut(int length) {
    if (length % 2 == 0)
        return length / 2;
    else
        return length / 2 + 1;
}

int cut_4(int length) {
    return length / 4;
}
/// @brief make Header Page and root page when the first insert happens
/// @param rec record to insert
void start_new_file(record rec) {
    page * root; 
    off_t ro; // root offset
    ro = new_page();
    rt = load_page(ro);
    hp->rpo = ro;
    pwrite(fd, hp, sizeof(H_P), 0);
    // 최적화 - 불필요한 IO
    // free(hp);
    // hp = load_header(0);
    
    // root page 설정
    rt->num_of_keys = 1;
    rt->is_leaf = 1;
    rt->records[0] = rec;
    pwrite(fd, rt, sizeof(page), hp->rpo);
    //최적화 - 불필요한 IO
    // free(rt);
    // rt = load_page(hp->rpo);
    if (verbose) printf("new file is made\n");
}

/// @brief insert (key, value) to data file at the right place
/// @param key the key to verify the record
/// @param value value to save
/// @return 0 if success, otherwise non-zero
int db_insert(int64_t key, char * value) {
    // 새로운 레코드를 만들고 key와 value를 저장한다.
    record nr; // new record
    nr.key = key;
    strcpy(nr.value, value);

    // 루트가 NULL 인 경우 == 저장된 레코드가 없다 == 새로 시작
    if (rt == NULL) {
        start_new_file(nr);
        return 0;
    }

    // 최적화
    off_t leaf = find_leaf(key); // leaf page offset
    char * dupcheck = find_value_from_leaf(leaf, key); // key duplication check
    // already exits
    if (dupcheck != NULL) {
        free(dupcheck);
        return -1;
    }
    free(dupcheck);

    // new key
    page * leafp = load_page(leaf); // leaf page

    // 1. 찾은 리프노드가 새로운 레코드를 수용할 수 있는 경우
    if (leafp->num_of_keys < LEAF_MAX) {
        insert_into_leaf(leaf, nr);
        free(leafp);
        return 0;
    }

    // 2. 수용할 수 없는 경우
    free(leafp);
    insert_into_leaf_decision(leaf, nr);
    return 0;
}


/// @brief inserts the record when the page has enough size to insert
/// @param leaf offset of the page to insert
/// @param inst the record to insert
/// @return offset of the page inserted
off_t insert_into_leaf(off_t leaf, record inst) {
    page * p = load_page(leaf);

    // find 잘못 구현한 경우
    // if (p->is_leaf == 0) if (verbose) printf("iil error : it is not leaf page\n");

    int i, insertion_point;
    insertion_point = 0;

    // insert할 위치 찾기
    while (insertion_point < p->num_of_keys && p->records[insertion_point].key < inst.key) {
        insertion_point++;
    }

    // 중간에 들어가는 경우 뒤 레코드 밀기
    for (i = p->num_of_keys; i > insertion_point; i--) {
        p->records[i] = p->records[i - 1];
    }

    // 삽입
    p->records[insertion_point] = inst;    
    p->num_of_keys++;
    pwrite(fd, p, sizeof(page), leaf);
    
    if (verbose) {
        printf("[insert] insert %ld into leaf page %ld is complete. nok = %d\n", inst.key, leaf, p->num_of_keys);
        printf("left:\n");
        for (int i = 0; i < p -> num_of_keys; ++i) {
            printf("%d %ld\n", i, p -> records[i].key);
        }
    }
    free(p);
    return leaf;
}

/// @brief insert the record after node split
/// @param leaf the offset of leaf tried to insert
/// @param temp sorted, leaf_max+1 records
/// @param inst the record to insert
/// @return offset of the node where record is inserted
off_t insert_into_leaf_as(off_t leaf, record * temp, record inst) {
    if(verbose) printf("[insert] insert into leaf after split happens\n");
    
    off_t new_leaf;
    int insertion_index, split, i, j;
    int64_t new_key;
    new_leaf = new_page();
    if (verbose) printf("\n%ld is new_leaf offset\n\n", new_leaf);
    page * nl = load_page(new_leaf); // new leaf
    nl->is_leaf = 1;

    page * ol = load_page(leaf); // original leaf

    ol->num_of_keys = 0;
    split = cut(LEAF_MAX);

    // temp의 반을 ol에 나머지를 nl에 복사
    for (i = 0; i < split; i++) {
        ol->records[i] = temp[i];
        ol->num_of_keys++;
    }
    for (i = split, j = 0; i < LEAF_MAX + 1; i++, j++) {
        nl->records[j] = temp[i];
        nl->num_of_keys++;
    }

    free(temp);

    nl->next_offset = ol->next_offset;
    ol->next_offset = new_leaf;

    // 굳이 해야 하나?
    for (i = ol->num_of_keys; i < LEAF_MAX; i++) {
        ol->records[i].key = 0;
        //strcpy(ol->records[i].value, NULL);
    }

    for (i = nl->num_of_keys; i < LEAF_MAX; i++) {
        nl->records[i].key = 0;
        //strcpy(nl->records[i].value, NULL);
    }

    nl->parent_page_offset = ol->parent_page_offset;
    new_key = nl->records[0].key;

    pwrite(fd, nl, sizeof(page), new_leaf);
    pwrite(fd, ol, sizeof(page), leaf);
    
    if (verbose) {
        printf("split_leaf is complete\n");
        printf("ol\n");
        for (int i= 0; i < ol -> num_of_keys; ++i) {
            printf("%d %ld\n", i, ol -> records[i].key);
        }
        printf("\nnl\n");
        for (int i= 0; i < nl -> num_of_keys; ++i) {
            printf("%d %ld\n", i, nl -> records[i].key);
        }
    } 
    
    free(ol);
    free(nl);

    return insert_into_parent(leaf, new_key, new_leaf);
}

/// @brief Determine how to handle it after checking the parent node
/// @param old old leaf
/// @param key the first key of new leaf
/// @param newp new leaf
/// @return offset of the node where record is inserted
off_t insert_into_parent(off_t old, int64_t key, off_t newp) {
    if (verbose) {
        printf("[insert] insert into parent\n");
    }
    int left_index;
    off_t bumo;
    page * left;
    left = load_page(old);

    bumo = left->parent_page_offset;
    free(left);

    // root split happens
    if (bumo == 0)
        return insert_into_new_root(old, key, newp);

    left_index = get_left_index(old);

    page * parent = load_page(bumo);
    if (verbose) printf("\nbumo is %ld\n", bumo);
    fflush(stdout); // clean
    // if internal node has enough space
    if (parent->num_of_keys < INTERNAL_MAX) {
        free(parent);
        if (verbose) printf("\nuntil here is ok\n");
        return insert_into_internal(bumo, left_index, key, newp);
    }
    // otherwise, split internal node

    // temp
    I_R  * temp = (I_R *)calloc(INTERNAL_MAX + 1, sizeof(I_R));
    int insert_idx = 0;
    int i, j;

    while (insert_idx < INTERNAL_MAX && parent -> b_f[insert_idx].key < key) {
        insert_idx++;
    }

    for (i = 0, j = 0; i < parent ->num_of_keys; ++i, ++j) {
        if (j == insert_idx) j++;
        temp[j] = parent -> b_f[i]; 
    }
    free(parent);

    temp[insert_idx].key = key;
    temp[insert_idx].p_offset = newp;

    off_t check = insert_into_internal_wr(bumo, temp, key);
    // a. rotation 이 가능한 경우
    if (check != -1) return 0;
    // b. split 해야하는 경우
    return insert_into_internal_as(bumo, left_index, key, newp);
}

/// @brief parent가 left를 가리키는 레코드의 위치를 반환한다
/// @param left offset of the page that you want to know the index
/// @return index of the record in parent page that has left page's offset
int get_left_index(off_t left) {
    page * child = load_page(left);
    off_t po = child->parent_page_offset; // parent offset
    free(child);
    page * parent = load_page(po);
    int i = 0;
    if (left == parent->next_offset) return -1; // 맨 처음, 즉 K1보다 작은 
    for (; i < parent->num_of_keys; i++) {
        if (parent->b_f[i].p_offset == left) break;
    }
    
    // parent 에 left 의 offset 이 없다 ??
    if (i == parent->num_of_keys) {
        free(parent);
        return -10;
    }
    free(parent);
    return i;
}

/// @brief when root split happens
/// @param old left node (less than key)
/// @param key separator
/// @param newp right node (greater than or equal to key)
/// @return 
off_t insert_into_new_root(off_t old, int64_t key, off_t newp) {
    off_t new_root;
    new_root = new_page();
    page * nr = load_page(new_root); //new root
    nr->b_f[0].key = key;
    nr->next_offset = old;
    nr->b_f[0].p_offset = newp;
    nr->num_of_keys++;
    page * left = load_page(old);
    page * right = load_page(newp);
    if (verbose) {
        printf("[insert] insert into new root : key = %ld, old = %ld, new = %ld, nok = %d, nr = %ld\n", key, old, newp, nr->num_of_keys, new_root);
        printf("\tleft node\n\t");
        if (left -> is_leaf) {
            for (int i = 0; i < left -> num_of_keys; ++i) {
                printf("%d %ld\n\t", i, left -> records[i].key);
            } 
        } else {
            for (int i = 0; i < left -> num_of_keys; ++i) {
                printf("%d %ld\n\t", i, left -> b_f[i].key);
            } 
        }
        printf("left's nok = %d\n", left -> num_of_keys);
        
        printf("\tright node\n\t");
        if (right -> is_leaf) {
            for (int i = 0; i < right -> num_of_keys; ++i) {
                printf("%d %ld\n\t", i, right -> records[i].key);
            } 
        } else {
            for (int i = 0; i < right -> num_of_keys; ++i) {
                printf("%d %ld\n\t", i, right -> b_f[i].key);
            } 
        }
        printf("right's nok = %d\n", right -> num_of_keys);
        
    }
    left->parent_page_offset = new_root;
    right->parent_page_offset = new_root;
    pwrite(fd, nr, sizeof(page), new_root);
    pwrite(fd, left, sizeof(page), old);
    pwrite(fd, right, sizeof(page), newp);
    // 최적화
    // 아래 두 작업은 안해도 될 거 같음
    free(nr);
    nr = load_page(new_root);
    // rt = load_page로 해도 될거같은데
    // free(nr) 도 없음
    rt = nr;
    // free(nr); // 내가 추가함
    hp->rpo = new_root;
    pwrite(fd, hp, sizeof(H_P), 0);
    // 아래 두 개도 필요 없을 것 같았는데 find 할 때 print 이상하게 되네
    free(hp);
    hp = load_header(0);
    free(left);
    free(right);
    return new_root;
}

/// @brief internal 노드에 레코드를 삽입한다
/// @param bumo 부모 노드
/// @param left_index key가 삽입될 위치 - 1
/// @param key 삽입할 레코드의 키
/// @param newp key보다 크거나 같은 페이지의 위치
/// @return 루트 페이지 위치
off_t insert_into_internal(off_t bumo, int left_index, int64_t key, off_t newp) {

    page * parent = load_page(bumo);
    int i;

    for (i = parent->num_of_keys; i > left_index + 1; i--) {
        parent->b_f[i] = parent->b_f[i - 1];
    }
    parent->b_f[left_index + 1].key = key;
    parent->b_f[left_index + 1].p_offset = newp;
    parent->num_of_keys++;
    pwrite(fd, parent, sizeof(page), bumo);
    free(parent);
    if (bumo == hp->rpo) {
        // 최적화
        free(rt);
        rt = load_page(bumo);
        if (verbose) {
            printf("[insert] insert into internal(root) complete\n");
            printf("\nrt->numofkeys = %d\n", rt->num_of_keys);
        }
    }
    if (verbose) {
        printf("[insert] insert into internal complete\n");
    }
    return hp->rpo;
}

/// @brief node split 이후 internal node에 레코드를 삽입한다
/// @param bumo 부모 노드의 위치
/// @param left_index key의 자리 - 1
/// @param key split을 통해 얻은 오른쪽 노드의 첫번째 값
/// @param newp split을 통해 생긴 새로운 leaf node
/// @return 최종 삽입 위치
off_t insert_into_internal_as(off_t bumo, int left_index, int64_t key, off_t newp) {
    if (verbose) printf("[insert] insert into internal after split\n");
    int i, j, split;
    int64_t k_prime;
    off_t new_p, child;
    I_R * temp;
    // temp 를 통해 정렬 맞추고
    temp = (I_R *)calloc(INTERNAL_MAX + 1, sizeof(I_R));

    page * old_parent = load_page(bumo);

    for (i = 0, j = 0; i < old_parent->num_of_keys; i++, j++) {
        // key 삽입 공간 남겨두기
        if (j == left_index + 1) j++;
        temp[j] = old_parent->b_f[i];
    }

    temp[left_index + 1].key = key;
    temp[left_index + 1].p_offset = newp;
    // temp 끝

    // 새로운 internal page를 만든다
    split = cut(INTERNAL_MAX);
    new_p = new_page();
    page * new_parent = load_page(new_p);

    // temp 의 레코드를 old와 new에 분배. 이때 k'은 중복될 수 없음 유의
    old_parent->num_of_keys = 0;
    for (i = 0; i < split; i++) {
        old_parent->b_f[i] = temp[i];
        old_parent->num_of_keys++;
    }

    k_prime = temp[i].key;
    
    new_parent->next_offset = temp[i].p_offset;
    
    for (++i, j = 0; i < INTERNAL_MAX + 1; i++, j++) {
        new_parent->b_f[j] = temp[i];
        new_parent->num_of_keys++;
    }
    // 분배 끝
    new_parent->parent_page_offset = old_parent->parent_page_offset; // 같은 부모 노드

    // 부모 설정
    page * nn;
    nn = load_page(new_parent->next_offset);
    nn->parent_page_offset = new_p;
    pwrite(fd, nn, sizeof(page), new_parent->next_offset);
    free(nn);
    for (i = 0; i < new_parent->num_of_keys; i++) {
        child = new_parent->b_f[i].p_offset;
        page * ch = load_page(child);
        ch->parent_page_offset = new_p;
        pwrite(fd, ch, sizeof(page), child);
        free(ch);
    }

    pwrite(fd, old_parent, sizeof(page), bumo);
    pwrite(fd, new_parent, sizeof(page), new_p);
    free(old_parent);
    free(new_parent);
    free(temp);
    if (verbose) printf("split internal is complete\n");
    return insert_into_parent(bumo, k_prime, new_p);
}

/* Deletion */

/// @brief find the matching record and delete it if found
/// @param key the key to delete
/// @return 0 if success, otherwise nonzero value
int db_delete(int64_t key) {
    if (rt == NULL || rt->num_of_keys == 0) {
        if (verbose) printf("root is empty\n");
        return -1;
    }
    
    // 최적화
    off_t leaf = find_leaf(key); // leaf page offset
    char * check = find_value_from_leaf(leaf, key);
    if (check== NULL) {
        free(check);
        if (verbose) printf("There are no key to delete\n");
        return -1;
    }
    free(check);

    // off_t deloff = find_leaf(key);
    delete_entry(key, leaf);
    return 0;
}


/// @brief record 를 지우고 난 뒤 어떤 행동을 해야할 지 선택한다
/// @param key 지우려는 레코드의 키
/// @param deloff 레코드가 있는 리프 페이지의 위치
void delete_entry(int64_t key, off_t deloff) {

    // 실제로 지우는 함수
    remove_entry_from_page(key, deloff);

    // root 에서 delete 가 일어났다면
    if (deloff == hp->rpo) {
        adjust_root(deloff);
        return;
    }

    // 최소조건(반이상) 을 만족하지 않는 지 검사한다
    // 만족하는 경우, 작업 끝

    page * not_enough = load_page(deloff);
    int check = not_enough->is_leaf ? cut_4(LEAF_MAX) : cut_4(INTERNAL_MAX);
    if (not_enough->num_of_keys >= check){
        free(not_enough);
        if (verbose) printf("just delete\n");
        return;  
    } 

    // 부족한 경우

    int neighbor_index, k_prime_index;
    off_t neighbor_offset, parent_offset;
    int64_t k_prime;
    parent_offset = not_enough->parent_page_offset;
    page * parent = load_page(parent_offset);

    // deloff 가 맨 첫번째 자식인 경우
    if (parent->next_offset == deloff) {
        neighbor_index = -2;
        neighbor_offset = parent->b_f[0].p_offset;
        k_prime = parent->b_f[0].key;
        k_prime_index = 0;
    }
    // 두 번째 자식인 경우
    else if(parent->b_f[0].p_offset == deloff) {
        neighbor_index = -1;
        neighbor_offset = parent->next_offset;
        k_prime_index = 0;
        k_prime = parent->b_f[0].key;
    }
    // 나머지
    else {
        int i;
        for (i = 0; i <= parent->num_of_keys; i++)
            if (parent->b_f[i].p_offset == deloff) break;
        neighbor_index = i - 1; // left
        neighbor_offset = parent->b_f[i - 1].p_offset;
        k_prime_index = i;
        k_prime = parent->b_f[i].key;
    }

    page * neighbor = load_page(neighbor_offset);
    int max = not_enough->is_leaf ? LEAF_MAX : INTERNAL_MAX - 1;
    int why = neighbor->num_of_keys + not_enough->num_of_keys;
    if (verbose) printf("%d %d\n",why, max);

    // 합치는 경우
    if (why <= max) {
        free(not_enough);
        free(parent);
        free(neighbor);
        coalesce_pages(deloff, neighbor_index, neighbor_offset, parent_offset, k_prime);
    }
    // 재분배하는 경우
    else {
        free(not_enough);
        free(parent);
        free(neighbor);
        redistribute_pages(deloff, neighbor_index, neighbor_offset, parent_offset, k_prime, k_prime_index);

    }
    return;
}

/// @brief 재분배 해주는 함수
/// @param need_more 레코드 수가 부족한 페이지(delete가 일어난 페이지)
/// @param nbor_index 부모 페이지에서 이웃 노드를 가리키는 래코드의 index
/// @param nbor_off 이웃페이지 위치
/// @param par_off 부모페이지 위치
/// @param k_prime 재분배 되는 키 값
/// @param k_prime_index 재분배 되는 키의 부모 페이지에서의 위치
void redistribute_pages(off_t need_more, int nbor_index, off_t nbor_off, off_t par_off, int64_t k_prime, int k_prime_index) {    
    page *need, *nbor, *parent;
    int i;
    need = load_page(need_more);
    nbor = load_page(nbor_off);
    parent = load_page(par_off);

    // need_more node가 leftmost가 아닌 경우
    if (nbor_index != -2) {
        // need_more 이 leaf가 아닌 경우
        if (!need->is_leaf) {
            if (verbose) printf("redis average interal\n");
            // need internal node의 레코드를 한 칸씩 민다
            for (i = need->num_of_keys; i > 0; i--)
                need->b_f[i] = need->b_f[i - 1];
            // need internal node의 첫번째 레코드는 neighbor의 마지막 record
            // internal record 는 중복이 있으면 안됨을 유의
            
            // 부모의 키가 내려와서 오른쪽 노드의 첫번째 키가 된다
            need->b_f[0].key = k_prime;
            // k_prime <= (need -> next_offset)
            // 포인터도 한 칸 옮긴 느낌
            need->b_f[0].p_offset = need->next_offset;
            // k'보다 작은 애들 포인터 설정
            need->next_offset = nbor->b_f[nbor->num_of_keys - 1].p_offset;
            // 부모설정
            page * child = load_page(need->next_offset);
            child->parent_page_offset = need_more;
            pwrite(fd, child, sizeof(page), need->next_offset);
            free(child);
            // 부모의 키는 왼쪽 노드의 마지막 키
            parent->b_f[k_prime_index].key = nbor->b_f[nbor->num_of_keys - 1].key;
            // 왼쪽 노드의 numOfKey를 줄여야 하지 않을까? -> 마지막에 하네용
        }
        // need_more 이 leaf인 경우
        else {
            if (verbose) printf("redis average leaf\n");
            // need의 레코드를 한칸씩 밀고
            for (i = need->num_of_keys; i > 0; i--){
                need->records[i] = need->records[i - 1];
            }
            // 맨 앞 레코드는 neighbor의 맨 마지막 record
            need->records[0] = nbor->records[nbor->num_of_keys - 1];
            // key를 그냥 0으로 바꾼건데...? 개수 줄었다고 표시하는게 맞지 않나 -> 마지막에 있음
            nbor->records[nbor->num_of_keys - 1].key = 0;
            // 이동한 레코드의 key를 internal의 key로 사용
            parent->b_f[k_prime_index].key = need->records[0].key;
        }
    }
    // leftmost 인 경우
    else {
        // need_more이 leaf인 경우
        if (need->is_leaf) {
            if (verbose) printf("redis leftmost leaf\n");
            // 맨 왼쪽 노드의 마지막 레코드를 오른쪽 노드의 첫번쩨 레코드로 한다.
            need->records[need->num_of_keys] = nbor->records[0];
            // 오른쪽 레코드의 순서를 하나씩 당긴다.
            for (i = 0; i < nbor->num_of_keys - 1; i++)
                nbor->records[i] = nbor->records[i + 1];
            // 오른쪽 레코드의 첫번째 값이 바뀌었으므로 부모의 key도 바꿔준다
            parent->b_f[k_prime_index].key = nbor->records[0].key;
        }
        // need_more이 leaf가 아닌 경우
        else {
            if (verbose) printf("redis leftmost internal\n");
            // internal node에는 중복이 없으므로 k'이 왼쪽 노드의 마지막 값이 된다.
            need->b_f[need->num_of_keys].key = k_prime;
            // neighbor의 첫번째 포인터를 왼쪽 노드의 마지막 포인터로
            need->b_f[need->num_of_keys].p_offset = nbor->next_offset;
            // 부모설정
            page * child = load_page(need->b_f[need->num_of_keys].p_offset);
            child->parent_page_offset = need_more;
            pwrite(fd, child, sizeof(page), need->b_f[need->num_of_keys].p_offset);
            free(child);
            // 부모의 키는 오른쪽 노드의 맨 첨 키
            parent->b_f[k_prime_index].key = nbor->b_f[0].key;
            // neighbor node의 첫번째 포인터 설정하기
            nbor->next_offset = nbor->b_f[0].p_offset;
            // neighbor node 레코드 한 칸 씩 댕기기
            for (i = 0; i < nbor->num_of_keys - 1 ; i++)
                nbor->b_f[i] = nbor->b_f[i + 1];   
        }
    }
    nbor->num_of_keys--;
    need->num_of_keys++;
    pwrite(fd, parent, sizeof(page), par_off);
    pwrite(fd, nbor, sizeof(page), nbor_off);
    pwrite(fd, need, sizeof(page), need_more);
    free(parent); free(nbor); free(need);
    return;
}

/// @brief 페이지를 합쳐주는 함수
/// @param will_be_coal 합쳐질 페이지의 위치
/// @param nbor_index 이웃 노드를 가리키는 부모 레코드의 인덱스
/// @param nbor_off 이웃 노드의 위치
/// @param par_off 부모 노드의 위치
/// @param k_prime 영향을 받는 부모 노드의 키
void coalesce_pages(off_t will_be_coal, int nbor_index, off_t nbor_off, off_t par_off, int64_t k_prime) {
    page *wbc, *nbor, *parent;
    off_t newp, wbf; // 합쳐진 페이지, 합쳐져서 사라질 페이지

    if (nbor_index == -2) {
        if (verbose) printf("leftmost\n");
        wbc = load_page(nbor_off); nbor = load_page(will_be_coal); parent = load_page(par_off);
        newp = will_be_coal; wbf = nbor_off;
    }
    else {
        wbc = load_page(will_be_coal); nbor = load_page(nbor_off); parent = load_page(par_off);
        newp = nbor_off; wbf = will_be_coal;
    }

    int point = nbor->num_of_keys;
    int le = wbc->num_of_keys; // left elements?
    int i, j;
    if (!wbc->is_leaf) {
        if (verbose) printf("coal internal\n");
        nbor->b_f[point].key = k_prime;
        nbor->b_f[point].p_offset = wbc->next_offset;
        nbor->num_of_keys++;

        for (i = point + 1, j = 0; j < le; i++, j++) {
            nbor->b_f[i] = wbc->b_f[j];
            nbor->num_of_keys++;
            wbc->num_of_keys--;
        }

        for (i = point; i < nbor->num_of_keys; i++) {
            page * child = load_page(nbor->b_f[i].p_offset);
            child->parent_page_offset = newp;
            pwrite(fd, child, sizeof(page), nbor->b_f[i].p_offset);
            free(child);
        }

    }
    else {
        if (verbose) printf("coal leaf\n");
        // neighbor에 모든 레코드를 옮긴다.
        int range = wbc->num_of_keys; // 이게 le 아님?
        for (i = point, j = 0; j < range; i++, j++) {
            nbor->records[i] = wbc->records[j];
            nbor->num_of_keys++;
            wbc->num_of_keys--;
        }
        // a -> b - > c => a -> c
        nbor->next_offset = wbc->next_offset;
    }
    pwrite(fd, nbor, sizeof(page), newp);
    
    // 부모 노드에서 k'을 지운다
    delete_entry(k_prime, par_off);
    free(wbc);
    usetofree(wbf);
    free(nbor);
    free(parent);
    return;
}

/// @brief 루트 페이지 조정 함수
/// @param deloff 레코드 삭제가 일어난 페이지의 위치
void adjust_root(off_t deloff) {
    // 루트노드는 하나의 레코드만 있어도 됨
    if (rt == NULL || rt->num_of_keys > 0)
        return;
    // 루트노트가 말단노드가 아니라면
    if (!rt->is_leaf) {
        off_t nr = rt->next_offset;
        page * nroot = load_page(nr);
        nroot->parent_page_offset = 0;
        usetofree(hp->rpo);
        hp->rpo = nr;
        pwrite(fd, hp, sizeof(H_P), 0);
        free(hp);
        hp = load_header(0);
        
        pwrite(fd, nroot, sizeof(page), nr);
        free(nroot);
        free(rt);
        rt = load_page(nr);

        return;
    }
    // 루트노드가 말단 노드일 때
    else {
        // 전체 레코드 개수 0개인 경우
        free(rt);
        rt = NULL;
        // 루트 페이지 프리
        usetofree(hp->rpo);
        hp->rpo = 0;
        pwrite(fd, hp, sizeof(hp), 0);
        free(hp);
        hp = load_header(0);
        return;
    }
}

/// @brief 실제로 레코드를 지우는 함수
/// @param key 지우려는 레코드의 키값
/// @param deloff 지우려는 레코드가 있는 페이지 위치
void remove_entry_from_page(int64_t key, off_t deloff) {
    
    int i = 0;
    page * lp = load_page(deloff);
    // delete in leaf
    if (lp->is_leaf) {
        if (verbose) printf("remove leaf key %ld\n", key);
        while (lp->records[i].key != key)
            i++;

        for (++i; i < lp->num_of_keys; i++)
            lp->records[i - 1] = lp->records[i];
        lp->num_of_keys--;
        pwrite(fd, lp, sizeof(page), deloff);
        // 노드가 하나라면
        if (deloff == hp->rpo) {
            free(lp);

            free(rt);
            rt = load_page(deloff);
            return;
        }
        
        free(lp);
        return;
    }
    // delete in internal
    else {
        if (verbose) printf("remove interanl key %ld\n", key);
        while (lp->b_f[i].key != key)
            i++;
        for (++i; i < lp->num_of_keys; i++)
            lp->b_f[i - 1] = lp->b_f[i];
        lp->num_of_keys--;
        pwrite(fd, lp, sizeof(page), deloff);
        if (deloff == hp->rpo) {
            free(lp);
            free(rt);
            rt = load_page(deloff);
            return;
        }
        
        free(lp);
        return;
    }   
}

char * find_value_from_leaf(off_t leaf, int64_t key) {
    page * leaf_page = load_page(leaf);

    if (leaf_page == NULL) {
        return NULL;
    }
    int left = 0;
    int right = leaf_page -> num_of_keys - 1;
    int mid;
    int64_t ref;    
    while (left <= right) {
        mid = (left + right) / 2;
        ref = leaf_page -> records[mid].key;
        if (ref == key) {
            char * value = (char *)malloc(sizeof(char)  * 120);
            strcpy(value, leaf_page -> records[mid].value);
            free(leaf_page);
            return value;    
        } else if (ref < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    free(leaf_page);
    return NULL;

    // int i = 0;

    // for (; i < leaf_page -> num_of_keys; ++i) {
    //     if (leaf_page -> records[i].key == key) break;
    // }
    // if (i == leaf_page -> num_of_keys) {
    //     free(leaf_page);
    //     return NULL;
    // } else {
    //     char * value = (char *)malloc(sizeof(char)  * 120);
    //     strcpy(value, leaf_page -> records[i].value);
    //     free(leaf_page);
    //     return value;
    // }
}


off_t insert_into_leaf_decision(off_t leaf, record nr) {
    if (verbose) printf("[leaf decision]\n");
    page * leafp = load_page(leaf);
    record * temp; // has leaf_max + 1 records
    int insert_idx = 0;
    int i, j;
    temp = (record *)calloc(LEAF_MAX + 1, sizeof(record));
    if (temp == NULL) {
        perror("Temporary records array");
        exit(EXIT_FAILURE);
    }

    while (insert_idx < LEAF_MAX && leafp -> records[insert_idx].key < nr.key) {
        insert_idx++;
    }

    for (i = 0, j = 0; i < leafp -> num_of_keys; ++i, ++j) {
        if (j == insert_idx) j++;
        temp[j] = leafp -> records[i];
    }  
    temp[insert_idx] = nr;
    
    
    off_t check = insert_into_leaf_wr(leaf, temp, nr);
    // a. roate 할 수 있는 경우
    if (check != -1) return check;
    // b. split
    return insert_into_leaf_as(leaf, temp, nr);
}

off_t insert_into_leaf_wr(off_t leaf, record * temp, record nr) {
    page * leafp = load_page(leaf); // leaf page
    off_t parent = leafp -> parent_page_offset; //parent page offset
    // if (verbose) printf("[key rotation] leaf: %ld, parent_offset: %ld\n", leaf, parent);
    fflush(stdout); //clear
    // root 인경우는 split 해야한다.
    if (parent == 0) {
        free(leafp);
        if (verbose) printf("[insert] key rotation failed. Root node\n");
        return -1;
    }

    page * parentp = load_page(parent); //parent page

    int lni; //left neighbor index
    int rni; // right neighbor index
    off_t lno; // left neighbor offset
    off_t rno; // right neighbor offset
    page * lnp; //left neighbor page
    page * rnp; //right neighbor page

    int i = 0;
    // leftmost
    if (leaf == parentp -> next_offset) {
        lno = -1;
        rni = 0;
        rno = parentp -> b_f[0].p_offset;
    } else {
        for (; i < parentp -> next_offset; ++i) {
            if (leaf == parentp -> b_f[i].p_offset) {
                // rightmost
                if (i == parentp -> num_of_keys - 1) {
                    lni = i - 1;
                    rno = -1;
                    // parent has only two child
                    if (i == 0) {
                        lno = parentp -> next_offset;
                        break;
                    } else {
                        lno = parentp -> b_f[lni].p_offset;
                        break;
                    }
                }
                // parent has more than 2 children
                // first child
                if (i == 0) {
                    lni = -1;
                    lno = parentp -> next_offset;
                    rni = i + 1;
                    rno = parentp -> b_f[rni].p_offset;
                    break;
                }
                lni = i - 1;
                rni = i + 1;
                lno = parentp -> b_f[lni].p_offset;
                rno = parentp -> b_f[rni].p_offset;
                break;
            }
        }
    }

    // 왼쪽 노드에 레코드 보내주기
    if (lno != -1) {
        lnp = load_page(lno);
        if (lnp -> num_of_keys < LEAF_MAX) {
            
            if (verbose) {
                printf("[insert] try to insert %ld with left rotate.\n\t original: nok=%d, leaf=%ld\n\t inserted noks=%d, leaf=%ld\n", nr.key, leafp ->num_of_keys, leaf, lnp ->num_of_keys, lno);
                printf("lnp:\n");
                for (int i = 0; i < lnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, lnp -> records[i].key);
                }
                printf("leaf:\n");
                for (int i = 0; i < leafp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, leafp -> records[i].key);
                }
            }

            int margin = LEAF_MAX - (lnp -> num_of_keys);
            int much = (margin + 1) / 2;

            for (int i = 0; i < much; ++i) {
                lnp -> records[lnp -> num_of_keys++] = temp[i];
            }

                // leafp->nok == leaf_max
            for (int i = 0; i < leafp -> num_of_keys - much + 1; ++i) {
                leafp -> records[i] = temp[much + i];
            }
            leafp -> num_of_keys -= (much - 1);

            parentp -> b_f[lni + 1].key = leafp -> records[0].key;

            // // 왼쪽 노드
            // lnp -> records[lnp -> num_of_keys] = temp[0];
            // lnp -> num_of_keys++;

            // // 리프 노드
            // for (int i = 0; i < leafp -> num_of_keys; ++i) {
            //     leafp -> records[i] = temp[i + 1];
            // }
            
            // // 부모 노드
            // parentp -> b_f[lni + 1].key = leafp->records[0].key;

            if (verbose) {
                printf("[insert] insert %ld is complete with left rotate.\n\t original: nok=%d, leaf=%ld\n\t inserted nok=%d, leaf=%ld\n", nr.key, leafp ->num_of_keys, leaf, lnp ->num_of_keys, lno);
                printf("lnp:\n");
                for (int i = 0; i < lnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, lnp -> records[i].key);
                }
                printf("leaf:\n");
                for (int i = 0; i < leafp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, leafp -> records[i].key);
                }
            }
            pwrite(fd, leafp, sizeof(page), leaf);
            pwrite(fd, lnp, sizeof(page), lno);
            pwrite(fd, parentp, sizeof(page), parent);
            
            free(temp);
            free(parentp);
            free(leafp);
            free(lnp);
            return lno;
        } else {
            free(lnp);
            if (verbose) printf("[insert] key rotation with left failed. No space\n");
        }
    } 
    
    // 오른쪽 노드에 레코드 보내주기
    if (rno != -1) {
        rnp = load_page(rno);
        if (rnp -> num_of_keys < LEAF_MAX) {
            if (verbose) {
                printf("[insert] try to insert %ld with right rotate.\n\t original: nok=%d, leaf=%ld\n\t inserted noks=%d, leaf=%ld\n", nr.key, leafp ->num_of_keys, leaf, rnp ->num_of_keys, rno);
                printf("rnp:\n");
                for (int i = 0; i < rnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, rnp -> records[i].key);
                }
                printf("leaf:\n");
                for (int i = 0; i < leafp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, leafp -> records[i].key);
                }
            }

            int margin = LEAF_MAX - (rnp -> num_of_keys);
            int much = (margin + 1) / 2;
            int i, j;

            // 오른쪽으로 밀고
            for (i = 0, j = rnp -> num_of_keys - 1; i < rnp -> num_of_keys; ++i, --j) {
                rnp -> records[j + much] = rnp -> records[j];
            }

            //much개 
            for (i = 0; i < much; ++i) {
                rnp -> records[much - 1 - i] = temp[LEAF_MAX - i];
            }
            rnp -> num_of_keys += much;
            
            // parent
            parentp -> b_f[rni - 1].key = rnp -> records[0].key;

            // self
            for (i = 0; i < leafp -> num_of_keys - much - 1; ++i) {
                leafp -> records[i] = temp[i];
            }
            leafp -> num_of_keys -= (much - 1);

            if (verbose) {
                printf("[insert] insert %ld is complete with right rotate.\n\t original: nok=%d, leaf=%ld\n\t inserted nok=%d, leaf=%ld\n", nr.key, leafp ->num_of_keys, leaf, rnp ->num_of_keys, rno);
                printf("rnp:\n");
                for (int i = 0; i < rnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, rnp -> records[i].key);
                }
                printf("leaf:\n");
                for (int i = 0; i < leafp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, leafp -> records[i].key);
                }
            }

            // for (int i = rnp -> num_of_keys - 1; i > 0; --i) {
            //     rnp -> records[i] = rnp -> records[i - 1];
            // }
            // rnp -> records[0] = temp[LEAF_MAX];
            // rnp -> num_of_keys++;

            // //  리프 노드
            // for (int i = 0; i < leafp -> num_of_keys; ++i) {
            //     leafp -> records[i] = temp[i];
            // }
            // // 부모 노드
            // parentp -> b_f[rni - 1].key = nr.key;    
            
            
            if (verbose) printf("[insert] insert %ld is complete with right rotate.\n\t original: nok=%d, leaf=%ld\n\t inserted nok=%d, leaf=%ld\n", nr.key, leafp ->num_of_keys, leaf, rnp ->num_of_keys, rno);
            pwrite(fd, leafp, sizeof(page), leaf);
            pwrite(fd, rnp, sizeof(page), rno);
            pwrite(fd, parentp, sizeof(page), parent);
            
            free(temp);
            free(parentp);
            free(leafp);
            free(rnp);
            return rno;
        } 
        free(rnp);
    }

    // 좌우 노드 모두 여유가 없는 경우 (split 해야 하는 경우)
    free(parentp);
    free(leafp);
    return -1;
}

/// @brief insert record to the internal page using key rotation
/// @param bumo internal page offset which has maxium size of keys
/// @param temp temporary internal record array, internal_max + 1 size
/// @param key the key from children to insert
/// @return offset of the page where rotated key inserted
off_t insert_into_internal_wr(off_t bumo, I_R * temp, int64_t key) {
    page * selfp = load_page(bumo);
    off_t parent = selfp -> parent_page_offset;
    page * parentp = load_page(parent);

    int lni; //left neighbor index
    int rni; // right neighbor index
    off_t lno; //left neighbor offset
    off_t rno; //right neighbor offset
    page * lnp; // left neighbor page
    page * rnp; // right neigbor page

    // root 인 경우는 split 해야한다
    if (selfp -> parent_page_offset == 0) {
        free(selfp);
        free(parentp);
        if (verbose) printf("[insert] internal key rotation failed. Root node\n");
        return -1;
    }

    // get_left_index 로 이웃정보를 가져와도 되겠지만 io가 더 생긴다
    int i = 0;
    // leftmost
    if (bumo == parentp -> next_offset) {
        lno = -1;
        rni = 0;
        rno = parentp -> b_f[0].p_offset;
    } else {
        for (; i < parentp -> num_of_keys; ++i) {
            if (bumo == parentp -> b_f[i].p_offset) {
                // rightmost
                if (i == parentp -> num_of_keys - 1) {
                    lni = i - 1;
                    rno = -1;
                    // parent has only two child
                    if (i == 0) {
                        lno = parentp -> next_offset;
                        break;
                    } else {
                        lno = parentp -> b_f[lni].p_offset;
                        break;
                    }
                }
                // parent has more than 2 children
                // first child
                if (i == 0) {
                    lni = -1;
                    lno = parentp -> next_offset;
                    rni = i + 1;
                    rno = parentp -> b_f[rni].p_offset;
                    break;
                }
                lni = i - 1;
                rni = i + 1;
                lno = parentp -> b_f[lni].p_offset;
                rno = parentp -> b_f[rni].p_offset;
                break;
            }
        }
    }
    //if (verbose) printf("lno : %ld, rno : %ld\n", lno, rno);
    // 왼쪽이 공간이 있는 경우
    if (lno != -1) {
        // return -1;
        // 왼쪽에 부모의 키값을 넣고, 포인터는 기존노드의 맨 왼족 포인터

        lnp = load_page(lno);
        
        if (verbose) {
            printf("printing all\n");
            printf("parent:\n");
            for (int i = 0; i < parentp -> num_of_keys; ++i) {
                printf("%d %ld\n", i, parentp -> b_f[i].key);
            }

            printf("lnp:\n");
            for (int i = 0; i < lnp -> num_of_keys; ++i) {
                printf("%d %ld\n", i, lnp -> b_f[i].key);
            } 

            printf("selfp:\n");
            for (int i = 0; i < selfp -> num_of_keys; ++i) {
                printf("%d %ld\n", i, selfp -> b_f[i].key);
            } 

            printf("lnp -> nok = %d, imax = %d\n", lnp -> num_of_keys, INTERNAL_MAX);
        }

        if (lnp -> num_of_keys < INTERNAL_MAX) {

            int margin = INTERNAL_MAX - lnp -> num_of_keys;
            int much = (margin + 1) / 2;

            lnp -> b_f[lnp -> num_of_keys].key = parentp -> b_f[lni + 1].key;
            lnp -> b_f[lnp -> num_of_keys].p_offset = selfp -> next_offset;
            lnp -> num_of_keys++;

            for (int i = 0; i < much - 1; ++i) {
                lnp -> b_f[lnp ->num_of_keys++] = temp[i];
            }

            pwrite(fd, lnp, sizeof(page), lno);

            parentp -> b_f[lni + 1].key = temp[much - 1].key;

            pwrite(fd, parentp, sizeof(page), parent);

            for (int i = 0; i < INTERNAL_MAX - much + 1; ++i) {
                selfp -> b_f[i] = temp[much + i];
            }

            selfp -> num_of_keys -= (much - 1);
            pwrite(fd, selfp, sizeof(page), bumo);

            if (verbose) printf("[insert] internal key left rotation.\n");
            
            if (verbose) {
                printf("printing all\n");
                printf("parent:\n");
                for (int i = 0; i < parentp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, parentp -> b_f[i].key);
                }

                printf("lnp:\n");
                for (int i = 0; i < lnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, lnp -> b_f[i].key);
                } 

                printf("selfp:\n");
                for (int i = 0; i < selfp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, selfp -> b_f[i].key);
                }
            }
            free(lnp);
            free(parentp);
            free(selfp);
            return lno;
        }
        free(lnp);
    }

    // 오른쪽이 공간이 있는 경우
    if (rno != -1) {
        rnp = load_page(rno);
        if (rnp -> num_of_keys < INTERNAL_MAX) {
            int margin = INTERNAL_MAX - rnp -> num_of_keys;
            int much = (margin + 1) / 2;
            int i, j;

            // 오른쪽 옮기고
            for (i = 0, j = rnp -> num_of_keys - 1; i < rnp -> num_of_keys; ++i, --j) {
                rnp -> b_f[j + much] = rnp -> b_f[j];
            }
            // 부모에서 내려오고
            rnp -> b_f[much - 1].key = parentp -> b_f[rni - 1].key;
            rnp -> b_f[much - 1].p_offset = selfp -> next_offset;

            // much - 1만큼 temp에서 끝에서 부터 레코드채로
            for (i = 0; i < much - 1; ++i) {
                rnp -> b_f[much - i] = temp[INTERNAL_MAX - i];
            }

            rnp -> num_of_keys += much;
            
            pwrite(fd, rnp, sizeof(page), rno);

            parentp -> b_f[rni - 1].key = temp[INTERNAL_MAX - much - 1].key;

            pwrite(fd, parentp, sizeof(page), parent);


            for (int i = 0; i < selfp -> num_of_keys - much - 1; ++i) {
                selfp -> b_f[i] = temp[i];
            }
            selfp -> num_of_keys -= (much - 1);

            pwrite(fd, selfp, sizeof(page), bumo);


            // lnp -> b_f[lnp -> num_of_keys].key = parentp -> b_f[lni + 1].key;
            // lnp -> b_f[lnp -> num_of_keys].p_offset = selfp -> next_offset;
            // lnp -> num_of_keys++;

            // for (int i = 0; i < much - 1; ++i) {
            //     lnp -> b_f[lnp ->num_of_keys++] = temp[i];
            // }

            // pwrite(fd, lnp, sizeof(page), lno);

            // parentp -> b_f[lni + 1].key = temp[much - 1].key;

            // pwrite(fd, parentp, sizeof(page), parent);

            // for (int i = 0; i < INTERNAL_MAX - much + 1; ++i) {
            //     selfp -> b_f[i] = temp[much + i];
            // }

            // selfp -> num_of_keys -= (much - 1);
            // pwrite(fd, selfp, sizeof(page), bumo);
            if (verbose) printf("[insert] internal key right rotation.\n");
        
            if (verbose) {
                printf("printing all\n");
                printf("parent:\n");
                for (int i = 0; i < parentp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, parentp -> b_f[i].key);
                }

                printf("rnp:\n");
                for (int i = 0; i < rnp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, rnp -> b_f[i].key);
                } 

                printf("selfp:\n");
                for (int i = 0; i < selfp -> num_of_keys; ++i) {
                    printf("%d %ld\n", i, selfp -> b_f[i].key);
                }
            }
            free(rnp);
            free(parentp);
            free(selfp);
            
            return rno;
        }
        free(rnp);
    }

    free(selfp);
    free(parentp);
    if (verbose) printf("[insert] internal key rotation failed. No space\n");
    return -1;
}