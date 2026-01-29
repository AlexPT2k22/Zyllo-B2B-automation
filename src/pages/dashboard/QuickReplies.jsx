import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2, Copy } from "lucide-react";

const quickReplies = [
  {
    id: 1,
    title: "Thank You",
    message: "Thanks so much for reaching out! We appreciate your support. 💜",
    category: "General",
    uses: 234,
  },
  {
    id: 2,
    title: "Shipping Info",
    message:
      "We ship worldwide! Delivery takes 5-10 business days. Free shipping on orders over $50.",
    category: "FAQ",
    uses: 189,
  },
  {
    id: 3,
    title: "Product Link",
    message:
      "Here's the link to our bestseller: [LINK]. Let me know if you have any questions!",
    category: "Sales",
    uses: 156,
  },
  {
    id: 4,
    title: "Discount Code",
    message: "Use code WELCOME15 for 15% off your first order! 🎉",
    category: "Promotions",
    uses: 312,
  },
  {
    id: 5,
    title: "Follow Up",
    message:
      "Just checking in! Did you have any other questions about our products?",
    category: "General",
    uses: 98,
  },
  {
    id: 6,
    title: "Returns Policy",
    message:
      "We offer 30-day free returns on all orders. Just reach out and we'll help you!",
    category: "FAQ",
    uses: 145,
  },
];

const categories = ["All", "General", "FAQ", "Sales", "Promotions"];

function QuickReplies() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredReplies =
    activeCategory === "All"
      ? quickReplies
      : quickReplies.filter((r) => r.category === activeCategory);

  return (
    <div className="quick-replies-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Quick Replies</h2>
          <p className="page-subtitle">
            Create reusable message templates for faster responses
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {/* Categories */}
      <div className="categories-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="templates-grid">
        {filteredReplies.map((reply) => (
          <Card key={reply.id} className="template-card">
            <CardHeader className="template-header">
              <div className="template-title-row">
                <CardTitle className="template-title">{reply.title}</CardTitle>
                <Badge variant="outline">{reply.category}</Badge>
              </div>
              <CardDescription className="template-uses">
                Used {reply.uses} times
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="template-message">{reply.message}</p>
              <div className="template-actions">
                <Button variant="ghost" size="sm" className="action-btn">
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm" className="action-btn">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" className="action-btn delete">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <style>{`
        .quick-replies-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .page-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0 0 0.25rem;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .categories-bar {
          display: flex;
          gap: 0.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .category-btn {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          background: none;
          border: 1px solid #e2e8f0;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          background-color: #f8fafc;
          color: #1e293b;
        }

        .category-btn.active {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border-color: transparent;
          color: white;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .template-card {
          transition: box-shadow 0.2s;
        }

        .template-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .template-header {
          padding-bottom: 0.5rem;
        }

        .template-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .template-title {
          font-size: 1rem;
        }

        .template-uses {
          margin-top: 0.25rem;
        }

        .template-message {
          font-size: 0.875rem;
          color: #475569;
          line-height: 1.6;
          margin: 0 0 1rem;
          padding: 0.75rem;
          background-color: #f8fafc;
          border-radius: 0.5rem;
          border-left: 3px solid #a855f7;
        }

        .template-actions {
          display: flex;
          gap: 0.25rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
        }

        .action-btn.delete:hover {
          color: #ef4444;
        }

        @media (max-width: 1024px) {
          .templates-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default QuickReplies;
