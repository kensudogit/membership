-- 会員管理システム初期化SQL

-- 店舗マスタ
CREATE TABLE IF NOT EXISTS stores (
    id BIGSERIAL PRIMARY KEY,
    store_code VARCHAR(50) UNIQUE NOT NULL,
    store_name VARCHAR(200) NOT NULL,
    address VARCHAR(500),
    phone VARCHAR(20),
    email VARCHAR(255),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 会員マスタ
CREATE TABLE IF NOT EXISTS members (
    id BIGSERIAL PRIMARY KEY,
    member_code VARCHAR(50) UNIQUE NOT NULL,
    store_id BIGINT REFERENCES stores(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    first_name_kana VARCHAR(100),
    last_name_kana VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    birthday DATE,
    gender VARCHAR(10),
    address VARCHAR(500),
    postal_code VARCHAR(10),
    member_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    enrollment_date DATE NOT NULL,
    enrollment_method VARCHAR(50) NOT NULL,
    face_recognition_data TEXT,
    profile_image_url VARCHAR(500),
    ip_whitelist TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 会員証発行履歴
CREATE TABLE IF NOT EXISTS member_cards (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    card_number VARCHAR(100) UNIQUE NOT NULL,
    card_type VARCHAR(50) NOT NULL,
    issued_date DATE NOT NULL,
    expiry_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    qr_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 契約ロッカー
CREATE TABLE IF NOT EXISTS lockers (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id),
    locker_number VARCHAR(50) NOT NULL,
    locker_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, locker_number)
);

-- ロッカー契約
CREATE TABLE IF NOT EXISTS locker_contracts (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    locker_id BIGINT REFERENCES lockers(id),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    monthly_fee DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 会費プラン
CREATE TABLE IF NOT EXISTS membership_plans (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id),
    plan_code VARCHAR(50) NOT NULL,
    plan_name VARCHAR(200) NOT NULL,
    monthly_fee DECIMAL(10, 2) NOT NULL,
    description TEXT,
    features JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, plan_code)
);

-- 会費契約
CREATE TABLE IF NOT EXISTS membership_contracts (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    plan_id BIGINT REFERENCES membership_plans(id),
    contract_start_date DATE NOT NULL,
    contract_end_date DATE,
    payment_method VARCHAR(50) NOT NULL,
    auto_renewal BOOLEAN DEFAULT true,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 口座振替情報
CREATE TABLE IF NOT EXISTS bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    bank_code VARCHAR(10) NOT NULL,
    branch_code VARCHAR(10) NOT NULL,
    account_type VARCHAR(10) NOT NULL,
    account_number VARCHAR(20) NOT NULL,
    account_holder_name VARCHAR(200) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- クレジットカード情報
CREATE TABLE IF NOT EXISTS credit_cards (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    card_brand VARCHAR(50) NOT NULL,
    last_four_digits VARCHAR(4) NOT NULL,
    expiry_month INTEGER NOT NULL,
    expiry_year INTEGER NOT NULL,
    card_token VARCHAR(500),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 会費請求
CREATE TABLE IF NOT EXISTS membership_bills (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES membership_contracts(id),
    billing_month DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_date DATE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, billing_month)
);

-- 商品マスタ
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id),
    product_code VARCHAR(50) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) DEFAULT 10.0,
    description TEXT,
    image_url VARCHAR(500),
    stock_quantity INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, product_code)
);

-- 販売履歴
CREATE TABLE IF NOT EXISTS sales (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id),
    member_id BIGINT REFERENCES members(id),
    sale_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 販売明細
CREATE TABLE IF NOT EXISTS sale_items (
    id BIGSERIAL PRIMARY KEY,
    sale_id BIGINT REFERENCES sales(id) ON DELETE CASCADE,
    product_id BIGINT REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    tax_rate DECIMAL(5, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 来場記録
CREATE TABLE IF NOT EXISTS visit_records (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    store_id BIGINT REFERENCES stores(id),
    visit_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    entry_method VARCHAR(50) NOT NULL,
    exit_date TIMESTAMP,
    duration_minutes INTEGER,
    face_recognized BOOLEAN DEFAULT false,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- スクールマスタ
CREATE TABLE IF NOT EXISTS schools (
    id BIGSERIAL PRIMARY KEY,
    store_id BIGINT REFERENCES stores(id),
    school_code VARCHAR(50) NOT NULL,
    school_name VARCHAR(200) NOT NULL,
    description TEXT,
    capacity INTEGER,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, school_code)
);

-- レッスン
CREATE TABLE IF NOT EXISTS lessons (
    id BIGSERIAL PRIMARY KEY,
    school_id BIGINT REFERENCES schools(id),
    lesson_code VARCHAR(50) NOT NULL,
    lesson_name VARCHAR(200) NOT NULL,
    lesson_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    instructor_name VARCHAR(200),
    price DECIMAL(10, 2),
    status VARCHAR(50) NOT NULL DEFAULT 'SCHEDULED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- レッスン予約
CREATE TABLE IF NOT EXISTS lesson_bookings (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    lesson_id BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'BOOKED',
    attendance_status VARCHAR(50),
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(member_id, lesson_id)
);

-- 外部連携（ゴルフシュミレーター、水素水サーバーなど）
CREATE TABLE IF NOT EXISTS external_integrations (
    id BIGSERIAL PRIMARY KEY,
    integration_type VARCHAR(50) NOT NULL,
    store_id BIGINT REFERENCES stores(id),
    device_id VARCHAR(100) NOT NULL,
    device_name VARCHAR(200),
    connection_status VARCHAR(50) NOT NULL DEFAULT 'DISCONNECTED',
    last_sync_at TIMESTAMP,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 外部デバイス利用履歴
CREATE TABLE IF NOT EXISTS device_usage_logs (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id) ON DELETE CASCADE,
    integration_id BIGINT REFERENCES external_integrations(id),
    usage_start_time TIMESTAMP NOT NULL,
    usage_end_time TIMESTAMP,
    usage_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 電話サポート履歴
CREATE TABLE IF NOT EXISTS support_calls (
    id BIGSERIAL PRIMARY KEY,
    member_id BIGINT REFERENCES members(id),
    store_id BIGINT REFERENCES stores(id),
    call_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    call_type VARCHAR(50) NOT NULL,
    inquiry_type VARCHAR(100),
    description TEXT,
    resolution TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    resolved_at TIMESTAMP,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- インデックス作成
CREATE INDEX idx_members_store_id ON members(store_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_enrollment_date ON members(enrollment_date);
CREATE INDEX idx_member_cards_member_id ON member_cards(member_id);
CREATE INDEX idx_locker_contracts_member_id ON locker_contracts(member_id);
CREATE INDEX idx_membership_contracts_member_id ON membership_contracts(member_id);
CREATE INDEX idx_membership_bills_member_id ON membership_bills(member_id);
CREATE INDEX idx_membership_bills_payment_status ON membership_bills(payment_status);
CREATE INDEX idx_sales_member_id ON sales(member_id);
CREATE INDEX idx_sales_store_id ON sales(store_id);
CREATE INDEX idx_visit_records_member_id ON visit_records(member_id);
CREATE INDEX idx_visit_records_visit_date ON visit_records(visit_date);
CREATE INDEX idx_lesson_bookings_member_id ON lesson_bookings(member_id);
CREATE INDEX idx_lesson_bookings_lesson_id ON lesson_bookings(lesson_id);
CREATE INDEX idx_device_usage_logs_member_id ON device_usage_logs(member_id);

-- 初期データ挿入
INSERT INTO stores (store_code, store_name, address, phone, email) VALUES
('STORE001', '本店', '東京都渋谷区1-1-1', '03-1234-5678', 'info@store001.com'),
('STORE002', '新宿店', '東京都新宿区2-2-2', '03-2345-6789', 'info@store002.com')
ON CONFLICT DO NOTHING;

INSERT INTO membership_plans (store_id, plan_code, plan_name, monthly_fee, description) VALUES
(1, 'BASIC', 'ベーシックプラン', 5000.00, '基本会費プラン'),
(1, 'PREMIUM', 'プレミアムプラン', 10000.00, 'プレミアム会費プラン'),
(2, 'BASIC', 'ベーシックプラン', 5000.00, '基本会費プラン')
ON CONFLICT DO NOTHING;

